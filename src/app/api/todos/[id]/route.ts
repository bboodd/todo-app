import { NextRequest, NextResponse } from "next/server";
import { todoService } from "@/lib/services/todo.service";

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
