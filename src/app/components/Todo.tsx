"use client";

import { editTodo,deleteTodo } from "@/api/index";
import { Task } from "@/types";
import React, { useRef, useState, useEffect } from "react";

interface TodoProps {
  todo: Task;
  onUpdateTask: (updatedTask: Task) => void; // 追加
  onDeleteTask: (id: string) => void; // 削除完了時に親コンポーネントへ通知するコールバック
}

const Todo = ({ todo, onUpdateTask,onDeleteTask }: TodoProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTaskTitle, setEditedTaskTitle] = useState(todo.text);

  useEffect(() => {
    if (isEditing) {
      ref.current?.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updatedTask = await editTodo(todo.id, editedTaskTitle);
      onUpdateTask(updatedTask); // 親に通知
      setIsEditing(false);
    } catch (error) {
      console.error("更新に失敗しました:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo(todo.id); // APIで削除
      onDeleteTask(todo.id); // 親コンポーネントに通知して状態更新
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <li
      key={todo.id}
      className="flex justify-between p-4 bg-white border-l-4 border-blue-500 rounded shadow"
    >
      {isEditing ? (
        <input
          ref={ref}
          type="text"
          className="mr-2 py-1 px-2 rounded border-gray-400 border"
          value={editedTaskTitle}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEditedTaskTitle(e.target.value)
          }
        />
      ) : (
        <span>{todo.text}</span>
      )}
      <div>
        {isEditing ? (
          <button className="text-blue-500 mr-3" onClick={handleSave}>
            Save
          </button>
        ) : (
          <button className="text-green-500 mr-3" onClick={handleEdit}>
            Edit
          </button>
        )}

        <button className="text-red-500" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </li>
  );
};

export default Todo;
