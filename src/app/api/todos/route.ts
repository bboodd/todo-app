import { NextRequest, NextResponse } from "next/server";
import { todoService } from "@/lib/services/todo.service";

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
