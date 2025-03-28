export default function TermsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 mt-12">
      <div className="w-full max-w-3xl mx-auto px-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-lg font-bold text-center m-6">利用規約</h1>

        <div className="bg-gray-100 text-gray-900 p-4 mb-6 text-left font-semibold leading-relaxed">
          ※このページはダミーページです。<br/>お問い合わせは送信されません。<br/>また、このページでリロードするとログアウトします。
        </div>

        <div className="space-y-12">
          <p className="text-gray-600">
            こちらはサービスの利用規約ページです。実際の利用規約の内容は、お客様に提供される正式なドキュメントを参照してください。
          </p>

          <section>
            <h2 className="text-md font-semibold text-gray-800">1. サービスの提供</h2>
            <p className="text-gray-600">
              （ 利用規約が入ります。）
            </p>
          </section>

          <section>
            <h2 className="text-md font-semibold text-gray-800">2. ユーザーの責任</h2>
            <p className="text-gray-600">
            （ 利用規約が入ります。）
            </p>
          </section>

          <section>
            <h2 className="text-md font-semibold text-gray-800">3. 免責事項</h2>
            <p className="text-gray-600">
            （ 利用規約が入ります。）
            </p>
          </section>

          <section>
            <h2 className="text-md font-semibold text-gray-800">4. プライバシー保護</h2>
            <p className="text-gray-600">
            （ 利用規約が入ります。）
            </p>
          </section>

          <section>
            <h2 className="text-md font-semibold text-gray-800">5. 利用規約の変更</h2>
            <p className="text-gray-600 mb-20">
            （ 利用規約が入ります。）
            </p>
          </section>
          </div>
          <p className="text-center text-gray-600 hover:underline m-8">
            <a href="/link/contact">お問い合わせページ から<br/>ご連絡ください。</a>
          </p>
      </div>
    </div>
  );
}
