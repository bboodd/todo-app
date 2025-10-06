import { NextRequest, NextResponse } from "next/server";
import { todoService } from "@/lib/services/todo.service";

/**
 * GET /api/todos
 *
 * 완료 상태와 우선순위로 선택적 필터링하여 모든 todo를 조회합니다
 *
 * @param {NextRequest} request - Next.js 요청 객체
 * @returns {Promise<NextResponse>} todo 배열 또는 오류가 포함된 JSON 응답
 *
 * @queryParam {string} [completed] - 완료 상태로 필터링 ("true" | "false")
 * @queryParam {string} [priority] - 우선순위 레벨로 필터링 ("low" | "medium" | "high")
 *
 * @example
 * GET /api/todos
 * GET /api/todos?completed=true
 * GET /api/todos?priority=high
 * GET /api/todos?completed=false&priority=medium
 *
 * @responses
 * 200: { success: true, data: Todo[] }
 * 500: { success: false, error: string }
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const completed = searchParams.get("completed");
    const priority = searchParams.get("priority");

    const filters: any = {};
    if (completed !== null) {
      filters.completed = completed === "true";
    }
    if (priority) {
      filters.priority = priority;
    }

    const todos = await todoService.findAll(filters);

    return NextResponse.json({
      success: true,
      data: todos,
    });
  } catch (error) {
    console.log("GET /api/todos error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch todos",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/todos
 *
 * 새로운 todo 항목을 생성합니다
 *
 * @param {NextRequest} request - JSON 본문이 포함된 Next.js 요청 객체
 * @returns {Promise<NextResponse>} 생성된 todo 또는 오류가 포함된 JSON 응답
 *
 * @requestBody
 * {
 *   title: string (필수),
 *   descriptrion?: string,
 *   priority?: "low" | "medium" | "high" (기본값: "medium"),
 *   dueDate?: string (ISO 날짜 형식)
 * }
 *
 * @example
 * POST /api/todos
 * Body: {
 *   "title": "장보기",
 *   "priority": "high",
 *   "dueDate": "2024-12-31"
 * }
 *
 * @responses
 * 201: { success: true, data: Todo }
 * 400: { success: false, error: "Title is required" }
 * 500: { success: false, error: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { title, descriptrion, priority, dueDate } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Title is required",
        },
        { status: 400 }
      );
    }

    const todo = await todoService.create({
      title: title.trim(),
      descriptrion: descriptrion?.trim(),
      priority: priority || "medium",
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        data: todo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("POST /api/todos error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create todo",
      },
      { status: 500 }
    );
  }
}
