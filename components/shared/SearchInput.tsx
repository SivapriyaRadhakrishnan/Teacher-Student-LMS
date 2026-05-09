"use client";

import { Search } from "lucide-react";

import { useRouter } from "next/navigation";

import { useState } from "react";

import { Input } from "@/components/ui/input";

type SearchInputProps = {
  placeholder?: string;
};

export default function SearchInput({
  placeholder,
}: SearchInputProps) {
  const router = useRouter();

  const [value, setValue] =
    useState("");

  function handleSearch(
    search: string
  ) {
    const params =
      new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    router.push(
      `?${params.toString()}`
    );
  }

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        placeholder={
          placeholder || "Search..."
        }
        className="pl-10"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);

          handleSearch(e.target.value);
        }}
      />
    </div>
  );
}