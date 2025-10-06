import { NextRequest, NextResponse } from "next/server";
import { todoService } from "@/lib/services/todo.service";

/**
 * GET /api/todos/:id
 *
 * ID로 단일 todo를 조회합니다
 *
 * @param {NextRequest} request - Next.js 요청 객체
 * @param {Object} params - 라우트 매개변수
 * @param {string} params.id - 조회할 todo의 UUID
 * @returns {Promise<NextResponse>} todo 또는 오류가 포함된 JSON 응답
 *
 * @example
 * GET /api/todos/123e4567-e89b-12d3-a456-426614174000
 *
 * @responses
 * 200: { success: true, data: Todo }
 * 404: { success: false, error: "Todo not found" }
 * 500: { success: false, error: string }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const todo = await todoService.findById(params.id);

    if (!todo) {
      return NextResponse.json(
        {
          success: false,
          error: "Todo not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: todo,
    });
  } catch (error) {
    console.log("GET /api/todos/:id error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch todo",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/todos/:id
 *
 * 부분 데이터로 기존 todo를 업데이트합니다
 *
 * @param {NextRequest} request - JSON 본문이 포함된 Next.js 요청 객체
 * @param {Object} params - 라우트 매개변수
 * @param {string} params.id - 업데이트할 todo의 UUID
 * @returns {Promise<NextResponse>} 업데이트된 todo 또는 오류가 포함된 JSON 응답
 *
 * @requestBody
 * {
 *   title?: string,
 *   descriptrion?: string,
 *   completed?: boolean,
 *   priority?: "low" | "medium" | "high",
 *   dueDate?: string (ISO 날짜 형식)
 * }
 *
 * @example
 * PATCH /api/todos/123e4567-e89b-12d3-a456-426614174000
 * Body: { "completed": true }
 *
 * @responses
 * 200: { success: true, data: Todo }
 * 404: { success: false, error: "Todo not found" }
 * 500: { success: false, error: string }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const todo = await todoService.update(params.id, body);

    if (!todo) {
      return NextResponse.json(
        {
          success: false,
          error: "Todo not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: todo,
    });
  } catch (error) {
    console.log("PATCH /api/todos/:id error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update todo",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/todos/:id
 *
 * ID로 todo를 영구적으로 삭제합니다
 *
 * @param {NextRequest} request - Next.js 요청 객체
 * @param {Object} params - 라우트 매개변수
 * @param {string} params.id - 삭제할 todo의 UUID
 * @returns {Promise<NextResponse>} 성공 메시지 또는 오류가 포함된 JSON 응답
 *
 * @example
 * DELETE /api/todos/123e4567-e89b-12d3-a456-426614174000
 *
 * @responses
 * 200: { success: true, message: "Todo deleted successfully" }
 * 404: { success: false, error: "Todo not found" }
 * 500: { success: false, error: string }
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await todoService.delete(params.id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "Todo not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.log("DELETE /api/todos/:id error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete todo",
      },
      { status: 500 }
    );
  }
}
