import BusinessSection from '../components/BusinessSection';

export default function Home() {
  return (
    <main className="min-h-[80vh] bg-gradient-to-br from-blue-50 to-cyan-50 p-0 md:p-8">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto py-12 px-4 md:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4 tracking-tight flex items-center justify-center gap-3">
          DB.INFO <span className="text-xs bg-blue-200 text-blue-700 rounded px-2 py-1 font-semibold align-top">IT INNOVATION</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-6">디비인포는 IT 혁신을 선도하는 기업입니다.<br className="hidden md:inline"/> 데이터베이스, SI, IT컨설팅, 솔루션 개발 등 다양한 사업을 수행합니다.</p>
      </section>

      {/* 회사소개(About Us) */}
      <section id="about" className="max-w-5xl mx-auto py-8 px-4">
      {/* 직원 예시 데이터 Firestore 등록 버튼 제거됨 */}
        <h2 className="text-xl font-bold text-blue-700 mb-3">회사소개</h2>
        <p className="text-gray-800 mb-3">
          <span className="font-semibold text-blue-800">무한열정과 변혁!</span> 디비인포는 신의를 최고의 가치로 삼고, 인재를 소중히 하며, 기술을 과감히 도입하여 변화와 혁신을 추구합니다.<br/>
          2011년 창립 이후 금융 및 공공기관 프로젝트를 수행하며 축적된 정보시스템 기술력과 비즈니스 노하우를 바탕으로, AI, IoT, Mobile 등 4차산업의 첨단 기술을 적극적으로 받아들여 새로운 비즈니스 창출에 힘쓰고 있습니다.<br/>
          앞으로도 최고의 IT서비스를 공급하는 것을 목표로, 고객에게 정직하고 최선을 다하는 성실한 기업이 되겠습니다.
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-2 space-y-1">
          <li>신뢰를 최고의 가치로 삼는 기업</li>
          <li>인재를 소중히 여기고 성장 지원</li>
          <li>최첨단 IT기술 도입과 혁신</li>
          <li>고객지향적 정보통신 서비스 제공</li>
        </ul>
        <div className="text-right text-sm text-gray-500 mt-2">대표이사 한규재 拜上</div>
      </section>

      {/* Vision & Mission */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 py-8 px-4">
        <div className="bg-white rounded-xl shadow p-6 text-left">
          <h2 className="text-xl font-bold text-blue-700 mb-2">비전</h2>
          <p className="text-gray-700">고객의 데이터 가치 극대화와 IT 혁신을 통한 미래 성장 동력 창출</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-left">
          <h2 className="text-xl font-bold text-blue-700 mb-2">미션</h2>
          <p className="text-gray-700">최고의 기술력과 신뢰를 바탕으로 고객의 성공을 지원하는 IT 파트너</p>
        </div>
      </section>

      {/* 연혁 */}
      <section className="max-w-5xl mx-auto py-8 px-4">
        <h2 className="text-lg font-bold text-blue-700 mb-4">연혁</h2>
        <ul className="text-gray-700 text-sm md:text-base space-y-1 mb-4">
          <li><span className="font-bold text-blue-700">2024</span> - LG헬로비전, CJ올리브네트웍스 등 대형 프로젝트 수행</li>
          <li><span className="font-bold text-blue-700">2023</span> - 국방기술품질원, 현대자동차, 삼성닷컴, KB증권, 하나은행 등 다양한 금융/공공/대기업 프로젝트</li>
          <li><span className="font-bold text-blue-700">2022</span> - 아모레퍼시픽, 삼성증권, 우리카드, 롯데카드, NICE평가, 신한은행, 제주은행 등 프로젝트</li>
          <li><span className="font-bold text-blue-700">2021</span> - 마이데이타(우리/기업/대구/농협은행), 신한은행 THE NEXT, 농협금융 바젤, 우체국금융 차세대 등</li>
          <li><span className="font-bold text-blue-700">2020</span> - 농협은행, 부산은행, 하나금융지주, 국민카드, 신한은행, 수협은행 등</li>
          <li><span className="font-bold text-blue-700">2019</span> - 하나은행, 우리은행, 한국행정공제회, 농협은행, 수출입은행, 국민카드, 주택보증공사 등</li>
          <li><span className="font-bold text-blue-700">2018</span> - 신한카드, 교보생명, 한국투자증권, 제일모직, 롯데카드, 산업은행, NH농협은행 등</li>
          <li><span className="font-bold text-blue-700">2017</span> - 신한카드, 하나금융지주, 제일모직, 삼성화재, 우리은행, 수출입은행, 한국장학재단 등</li>
          <li><span className="font-bold text-blue-700">2016</span> - KEB하나은행, 신한카드, 제일모직, 국방부, NH농협생명, KB국민은행, 동부화재, CJ제일제당 등</li>
          <li><span className="font-bold text-blue-700">2011~2015</span> - 신한카드, 외환은행, CJ대한통운, NH농협은행, 메리츠화재, 하나외환은행, 현대카드, 우체국금융, 아모레퍼시픽, 관세청, 대학 차세대 시스템 등</li>
        </ul>
        <div className="text-xs text-gray-500">* 주요 연혁은 공식 홈페이지 및 최근 프로젝트 기준 요약</div>
      </section>

      {/* 조직도 */}
      <section className="max-w-5xl mx-auto py-8 px-4">
        <h2 className="text-lg font-bold text-blue-700 mb-4">조직도</h2>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img src="/images/watch-03.jpg" alt="조직도" className="w-full max-w-xl rounded-xl shadow-lg border-2 border-blue-100 bg-white" />
          <div className="flex-1 text-gray-700 text-sm md:text-base mt-4 md:mt-0">
            <ul className="list-disc list-inside space-y-1">
              <li>3개 사업부(금융/공공/기술연구소)로 구성</li>
              <li>각 사업부별 핵심 인력 보유</li>
              <li>품질혁신, 고객만족, 미래 AI기술 연구</li>
              <li>기술연구소는 인공지능 등 미래기술 전문 준비</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 사업영역 */}
      <section id="business" className="max-w-5xl mx-auto py-8 px-4">
        <h2 className="text-lg font-bold text-blue-700 mb-8">주요 사업영역</h2>
        {/* ...BusinessSection 컴포넌트들... */}
        <BusinessSection
          image="/images/sphere-01.jpg"
          title="AI DataSet Platform"
          subtitle="(인공지능 데이터셋 플랫폼)"
          description1="인공지능을 학습시키기 위해서 필수적으로 갖춰져야 할 것은 많은 양질의 데이터입니다. 데이터가 많을수록 학습의 정확도가 높아지고 예측을 더 정확하게 할 수 있습니다."
          description2={'기계 학습에 필요한 데이터를 수집하기 위해서는 엄청난 시간과 노력이 필요하지만 디비인포의 "인공지능 데이터셋 플랫폼"을 이용하여 손쉽게 모바일이나 웹상에서 공유되고 기록되는 정보와 데이터를 수집, 정제, 가공하여 양질의 데이터를 확보할 수 있습니다.'}
          features={["데이터 수집/정제/가공 자동화", "대용량 데이터 라벨링 및 품질 관리", "AI 학습 데이터셋 제공"]}
        />
        <BusinessSection
          image="/images/sphere-02.jpg"
          title="SI (System Integration)"
          subtitle="시스템 통합 구축"
          description1="정보화 전략수립, 업무분석/설계/구축, 시스템 운영까지 전 과정 통합 서비스. 금융·공공기관 등 다양한 SI사업 수행 경험."
          description2="정보화 전략, 아키텍처 설계, DB설계, 솔루션 제공, H/W, S/W, 네트워크 등 기반기술 통합 및 통합 유지보수까지 제공합니다."
          features={["정보화 전략/아키텍처 설계", "DB설계, 솔루션 제공", "H/W, S/W, 네트워크 통합", "통합 유지보수"]}
        />
        <BusinessSection
          image="/images/sphere-03.jpg"
          title="E-Commerce"
          subtitle="전자상거래 시스템 구축"
          description1="클라우드·빅데이터·AI 기반 전자상거래 시스템 구축, 머신러닝 기반 고객 행동 예측, 맞춤형 마케팅 및 데이터 분석."
          description2="AI 기반 고객 행동 예측, 데이터 분석/마케팅 자동화, 지도/비지도 학습 모델, 스마트 커머스 시스템 등 다양한 서비스를 제공합니다."
          features={["AI 기반 고객 행동 예측", "데이터 분석/마케팅 자동화", "지도/비지도 학습 모델", "스마트 커머스 시스템"]}
        />
        <BusinessSection
          image="/images/sphere-04.jpg"
          title="AI ChatBot Service"
          subtitle="인공지능 챗봇 서비스"
          description1="금융, 공공, 유통 등 다양한 산업에 적용 가능한 AI 챗봇. 시나리오 기반 대화, 상품 안내/구매/결제 등 시스템 연계."
          description2="시나리오 기반 챗봇, 다양한 메시지 응답, 기간계 시스템 연계, AI 기반 고객지원 등 다양한 기능을 제공합니다."
          features={["시나리오 기반 챗봇", "다양한 메시지 응답", "기간계 시스템 연계", "AI 기반 고객지원"]}
        />
        <BusinessSection
          image="/images/sphere-05.jpg"
          title="AI Demand Prediction"
          subtitle="인공지능 수요예측"
          description1="머신러닝 기반 수요예측 솔루션. 이벤트, 계절, 트렌드 등 다양한 변수 반영, 재고/자원 최적화."
          description2="수요예측 모델 개발, 재고/자원 최적화, 매출 증대 지원, 다양한 변수 반영 등 실질적 비즈니스 효과를 제공합니다."
          features={["수요예측 모델 개발", "재고/자원 최적화", "매출 증대 지원", "다양한 변수 반영"]}
        />
        <BusinessSection
          image="/images/sphere-06.jpg"
          title="AI Model 연구개발"
          subtitle="기술연구소"
          description1="자율주행, 드론, 로봇 등 미래 AI 기술 연구. 머신러닝/딥러닝 모델 개발 및 적용."
          description2="미래 AI 기술 연구, 머신러닝/딥러닝 모델, 산업별 AI 적용, 기술 세미나/교육 등 다양한 연구개발을 수행합니다."
          features={["미래 AI 기술 연구", "머신러닝/딥러닝 모델", "산업별 AI 적용", "기술 세미나/교육"]}
        />
      </section>

      {/* 구성원 */}
      <section className="max-w-5xl mx-auto py-8 px-4">
        <h2 className="text-lg font-bold text-blue-700 mb-4">주요 구성원</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* 대표이사 카드 */}
          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition">
            <div className="w-20 h-20 mb-3 rounded-full bg-white shadow flex items-center justify-center overflow-hidden">
              <img src="/images/president.jpg" alt="홍길동" className="w-full h-full object-cover rounded-full" onError={e => {e.currentTarget.src = 'https://em-content.zobj.net/thumbs/240/apple/354/man-office-worker_1f468-200d-1f4bc.png'}} />
            </div>
            <span className="text-2xl font-bold text-blue-800 mb-1">홍길동</span>
            <span className="text-sm font-semibold text-cyan-700 mb-2">대표이사</span>
            <span className="text-4xl">👨‍💼</span>
          </div>
          {/* 기술이사 카드 */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition">
            <div className="w-20 h-20 mb-3 rounded-full bg-white shadow flex items-center justify-center overflow-hidden">
              <img src="/images/tech-director.jpg" alt="김철수" className="w-full h-full object-cover rounded-full" onError={e => {e.currentTarget.src = 'https://em-content.zobj.net/thumbs/240/apple/354/man-technologist_1f468-200d-1f4bb.png'}} />
            </div>
            <span className="text-2xl font-bold text-blue-800 mb-1">김철수</span>
            <span className="text-sm font-semibold text-cyan-700 mb-2">기술이사</span>
            <span className="text-4xl">🧑‍💻</span>
          </div>
          {/* DB컨설턴트 카드 */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition">
            <div className="w-20 h-20 mb-3 rounded-full bg-white shadow flex items-center justify-center overflow-hidden">
              <img src="/images/db-consultant.jpg" alt="이영희" className="w-full h-full object-cover rounded-full" onError={e => {e.currentTarget.src = 'https://em-content.zobj.net/thumbs/240/apple/354/woman-office-worker_1f469-200d-1f4bc.png'}} />
            </div>
            <span className="text-2xl font-bold text-blue-800 mb-1">이영희</span>
            <span className="text-sm font-semibold text-cyan-700 mb-2">DB컨설턴트</span>
            <span className="text-4xl">👩‍💼</span>
          </div>
        </div>
      </section>

      {/* 채용정보(Recruit) */}
      <section id="recruit" className="max-w-5xl mx-auto py-8 px-4">
        <h2 className="text-lg font-bold text-blue-700 mb-4">채용정보</h2>
        <p className="text-gray-800 mb-3">
          <span className="font-semibold text-blue-800">꿈과 미래가 있는 회사는 좋은 인재로부터 출발합니다.</span><br />
          디비인포는 건강한 사회인, 최고의 전문가를 지향하며, Global IT Leader를 향해 도전하는 창의적인 인재를 찾습니다.<br />
          자신의 꿈을 펼치고 싶은 분들의 많은 지원을 기다립니다.
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-2 space-y-1">
          <li><span className="font-bold">채용절차:</span> 1차 서류전형(이메일접수: <a href="mailto:6511kesuk@db-info.co.kr" className="underline text-blue-600">6511kesuk@db-info.co.kr</a>) → 2차 면접전형</li>
          <li><span className="font-bold">모집시기:</span> 연중 수시모집(신입/경력)</li>
          <li><span className="font-bold">응시자격:</span> 나이/성별 무관, 전문대학/대학졸업 이상, Java/JSP/Pro*C/SQL 등 경력자 우대</li>
          <li><span className="font-bold">복리후생:</span> 4대보험, 장기근속/우수사원 포상, 퇴직금, 주5일근무, 정기/특별휴가, 각종 경조금</li>
          <li><span className="font-bold">제출서류:</span> 이력서(휴대전화, 희망연봉 명기)</li>
          <li><span className="font-bold">문의처:</span> 김애숙 이사, 02-780-0386</li>
        </ul>
        <div className="text-xs text-gray-500">* 자세한 내용은 공식 홈페이지 채용정보 참고</div>
      </section>

      {/* 연락처 */}
      <section className="max-w-5xl mx-auto py-8 px-4">
        <h2 className="text-lg font-bold text-blue-700 mb-2">연락처 및 위치</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="mb-1">주소: 서울특별시 금천구 서부샛길 606, 대성디플리스 지식산업센터 B동 1410호</p>
          <p className="mb-1">대표전화: 02-1234-5678</p>
          <p className="mb-1">이메일: info@dbinfo.co.kr</p>
          <p className="mb-1">대중교통: 1호선, 7호선 8번 출구 500미터</p>
        </div>
      </section>

    </main>
  );
}
