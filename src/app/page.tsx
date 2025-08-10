'use client';

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto p-6 flex flex-col items-center min-h-screen justify-center">
      <h1 className="text-4xl font-extrabold mb-6 text-center">
        지금까지 얼마 썼을까?
      </h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        Google Play 스토어에서 결제한 모든 구매 내역을 조회하고 과거를 돌아보세요
      </p>

      <nav className="flex gap-6">
        <a
          href="/purchase-history"
          className="px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
        >
          조회하러 가기
        </a>
        <a
          href="/about"
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md shadow hover:bg-gray-300 transition"
        >
          소개 페이지
        </a>
      </nav>
    </main>
  );
}
