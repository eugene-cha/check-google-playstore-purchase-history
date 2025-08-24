'use client';

import React, {
  useState,
  useEffect,
} from 'react';

import TableSkeleton from './components/TableSkeleton';
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
  const [ loading, setLoading ] = useState(false);
  const [ parsedData, setParsedData ] = useState<ParsedPurchaseHistory | null>(null);
  const [ error, setError ] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(()=> {
      // NOTE: localStorage는 동기적이라서 의도적으로 setTimeout을 주지 않으면 로딩이 너무 빨라 스켈레톤 UI 노출 불가능
      // 스켈레톤 UI 테스트용으로 붙여놓은 것
      const json = localStorage.getItem(STORAGE_KEY);
      if (json) {
        resolveParsedData(json);
        setLoading(false);
      }
    }, 1000);

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

    setLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target?.result;
      if (typeof json !== 'string') {
        setError('파일 내용을 읽을 수 없습니다.');
        setLoading(false);
        return;
      }

      localStorage.setItem(STORAGE_KEY, json); // save origin
      resolveParsedData(json);
      setLoading(false);
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

      {loading && <TableSkeleton />}

      {!loading && parsedData && parsedData.length > 0 && (
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
              <tr className="bg-gray-100 font-bold">
                <td colSpan={3} className="border px-4 py-2 text-center">
                  총합
                </td>
                <td className="border px-4 py-2 text-right">
                  {parsedData.reduce((sum, item) => sum + item.invoicePriceNumber, 0).toLocaleString()}
                </td>
                <td className="border px-4 py-2"></td>
              </tr>
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
