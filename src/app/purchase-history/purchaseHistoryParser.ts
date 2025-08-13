type PurchaseHistory = {
  purchaseHistory: {
    invoicePrice: string; // 청구 금액 (실제로 결제 했으나 반환값이 0인 경우가 있음. Play 스토어가 아닌 다른 Google APP에서 결제 기록을 보유한 것)
    paymentMethodTitle: string; // 결제 수단
    userLanguageCode: string; // 사용자 언어 코드
    userCountry: string; // 사용자 국가 코드
    doc: {
      documentType: string; // 상품 유형 (구독, 인앱아이템)
      title: string; // 상품명
    },
    purchaseTime: string; // 결제 시각
  },
};

export function parsePurchaseHistoryJson(jsonText: string) {
  try {
    const json = JSON.parse(jsonText);

    const data = json.map((item: PurchaseHistory) => {
      const { invoicePrice, doc, purchaseTime } = item.purchaseHistory;
      const { documentType, title } = doc;

      const invoicePriceNumber = Number(invoicePrice.replace(/[₩,]/g, '')); // '₩'과 ',' 문자 모두 제거

      return {
        title,
        documentType,
        invoicePrice,
        invoicePriceNumber, // 총 합계 계산용
        purchaseTime,
      };
    });

    return {
      success: true,
      data,
    };
  } catch (e) {
    return {
      success: false,
      error: (e as Error).message,
    };
  }
}
