'use client';

import React, { useState } from 'react';

export default function PurchaseHistory() {
  const [ fileContent, setFileContent ] = useState<string | null>(null);
  const [ error, setError ] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return; // 파일 탐색기에서 아무것도 열지 않고 취소
    }

    if (file.type !== 'application/json') {
      setError('파일 확장자가 .json 이 아닌 파일은 업로드할 수 없습니다.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== 'string') {
          throw new Error('파일 내용을 읽을 수 없습니다.');
        }
        setFileContent(text);
      } catch (err: any) {
        setError('파일 읽기 실패: ' + err.message);
      }
    };

    reader.readAsText(file);
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4 text-center">구매 내역 파일 업로드</h1>
      <input
        type="file"
        accept=".json,application/json,.txt"
        onChange={handleFileChange}
        className="block w-full text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-100 file:text-blue-700
                   file:cursor-pointer
                   cursor-pointer
                   hover:file:bg-blue-200"
      />

      {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}

      {fileContent && (
        <section className="mt-6">
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md">
            {fileContent}
          </pre>
        </section>
      )}
    </main>
  );
}
