'use client';

import React, {
  useState,
  useEffect,
} from 'react';

import { parsePurchaseHistoryJson } from './purchaseHistoryParser';

type ParsedPurchaseHistory = Array<{
  title: string,
  invoicePrice: string,
  invoicePriceNumber: number,
  documentType: string,
  purchaseTime: string,
}>;

const STORAGE_KEY = 'uploadedPurchaseFile';

export default function PurchaseHistory() {
  const [ parsedData, setParsedData ] = useState<ParsedPurchaseHistory | null>(null);
  const [ error, setError ] = useState<string | null>(null);

  useEffect(() => {
    const json = localStorage.getItem(STORAGE_KEY);
    if (json) {
      resolveParsedData(json);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);

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
      const json = event.target?.result;
      if (typeof json !== 'string') {
        setError('파일 내용을 읽을 수 없습니다.');
        return;
      }

      // save origin
      localStorage.setItem(STORAGE_KEY, json);

      resolveParsedData(json);
    };
    reader.readAsText(file);
  };

  /**
   * JSON 데이터를 파싱하고 렌더링 상태값에 할당
   * @param json
   */
  const resolveParsedData = (json: string) => {
    const { success, data, error } = parsePurchaseHistoryJson(json);
    if (!success) {
      setError('JSON 파싱 오류: ' + error);
      return;
    }
    setParsedData(data);
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4 text-center">구매 내역 파일 업로드</h1>
      <input
        type="file"
        accept=".json,application/json"
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

      {parsedData && parsedData.length > 0 && (
        <section className="mt-6">
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-blue-100"> {/* TODO: FixedTab */}
              <tr>
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">상품명</th>
                <th className="border px-4 py-2">유형</th>
                <th className="border px-4 py-2">가격(₩)</th>
                <th className="border px-4 py-2">결제 시각</th>
              </tr>
            </thead>
            <tbody>
              {parsedData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-center">{index + 1}</td>
                  <td className="border px-4 py-2">{item.title}</td>
                  <td className="border px-4 py-2">{item.documentType}</td>
                  <td className="border px-4 py-2 text-right">{item.invoicePrice}</td>
                  <td className="border px-4 py-2">{item.purchaseTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
