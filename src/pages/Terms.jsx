import React from "react";
import { STORE_INFO } from "../utils/constants.js";
import BackButton from "../components/common/BackButton";

const Terms = () => {
  return (
    <div className="min-h-screen text-right" dir="rtl">
      <div className="container mx-auto px-4 max-w-4xl">
      <BackButton />
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white my-6">
            الشروط والأحكام
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            آخر تحديث: ديسمبر 2025
          </p>
        </div>

        <div className="space-y-12">
          {/* 1. الشروط العامة */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ١. الشروط العامة
            </h2>
            <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                مرحباً بكم في متجر نكست. إن دخولك واستخدامك لموقعنا يعني موافقتك
                الكاملة على الالتزام بهذه الأحكام والشروط. نرجو قراءة هذه الصفحة
                بعناية قبل استخدام الموقع أو شراء أي من منتجاتنا.
              </p>
              <ul className="list-disc pr-6 space-y-2">
                <li>
                  يحق للمتجر تعديل أو تحديث هذه الشروط في أي وقت دون إشعار مسبق.
                </li>
                <li>
                  استمرارك في استخدام الموقع بعد أي تعديل يعني موافقتك على
                  الشروط الجديدة.
                </li>
                <li>
                  يحق للمتجر رفض تقديم الخدمة لأي شخص في أي وقت إذا ثبت إساءة
                  الاستخدام.
                </li>
              </ul>
            </div>
          </section>

          {/* 2. الحسابات */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ٢. الحسابات
            </h2>
            <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
              <p>لضمان تجربة تسوق آمنة ومخصصة، نقدم نظام حسابات للعملاء.</p>
              <ul className="list-disc pr-6 space-y-2">
                <li>
                  قد يُطلب من العميل تسجيل حساب عند الشراء لتسهيل متابعة
                  الطلبات.
                </li>
                <li>
                  العميل مسؤول عن سرية بيانات دخوله (البريد الإلكتروني وكلمة
                  المرور).
                </li>
                <li>
                  لا يتحمل المتجر أي مسؤولية عن أي استخدام غير مصرح به للحساب
                  الشخصي.
                </li>
                <li>سيتم إشعارك بأي تغييرات تطرأ على حسابك أو طلباتك.</li>
              </ul>
            </div>
          </section>

          {/* 3. المنتجات */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ٣. المنتجات
            </h2>
            <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
              <p className="mb-4">
                نسعى لتقديم منتجات عالية الجودة مع وصف دقيق وواضح.
              </p>
              <ul className="list-disc pr-6 space-y-2">
                <li>
                  جميع المنتجات المعروضة في المتجر كما هي دون أي ضمانات إضافية
                  إلا ما تم ذكره في الوصف.
                </li>
                <li>
                  الصور المعروضة تقريبية وقد تختلف عن الواقع قليلاً بسبب اختلاف
                  شاشات العرض والإضاءة.
                </li>
                <li>يحق للمتجر تعديل أو حذف أي منتج دون إشعار مسبق.</li>
                <li>
                  المنتجات المصممة خصيصاً (Custom) لا تشملها سياسة الإرجاع إلا
                  في حال وجود عيب مصنعي.
                </li>
              </ul>
              <div className="mt-4 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-sm text-amber-500">
                <strong>ملاحظة:</strong> نحرص على تصوير المنتجات بأقصى درجة من
                الدقة، ولكن الاختلافات البسيطة في الألوان ممكنة نتيجة اختلاف
                إعدادات الشاشة.
              </div>
            </div>
          </section>

          {/* 4. الأسعار والدفع */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ٤. الأسعار والدفع
            </h2>
            <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-6">
              <p>نسعى لتقديم أسعار تنافسية مع وسائل دفع متنوعة وآمنة.</p>
              <ul className="list-disc pr-6 space-y-2">
                <li>جميع الأسعار معروضة بالريال اليمني (YER).</li>
                <li>
                  يحتفظ المتجر بالحق في تعديل الأسعار في أي وقت دون إشعار مسبق.
                </li>
                <li>الدفع يتم عبر الوسائل الموضحة في صفحة الشراء.</li>
              </ul>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right bg-gray-100 dark:bg-gray-800 rounded-xl">
                  <thead>
                    <tr>
                      <th className="p-3 text-black dark:text-white">
                        طريقة الدفع
                      </th>
                      <th className="p-3 text-black dark:text-white">الحالة</th>
                      <th className="p-3 text-black dark:text-white">
                        ملاحظات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3">التحويل البنكي</td>
                      <td className="p-3">متاح</td>
                      <td className="p-3">عبر البنوك المحلية</td>
                    </tr>
                    <tr>
                      <td className="p-3">الدفع عند الاستلام</td>
                      <td className="p-3 text-amber-500">قريباً</td>
                      <td className="p-3">للمدن الرئيسية</td>
                    </tr>
                    <tr>
                      <td className="p-3">البطاقات الإئتمانية</td>
                      <td className="p-3 text-amber-500">قريباً</td>
                      <td className="p-3">قيد التطوير</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 5. الشحن والتسليم */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ٥. الشحن والتسليم
            </h2>
            <p>نعمل على توصيل طلباتك في أسرع وقت ممكن وبأعلى معايير الجودة.</p>
            <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
              <ul className="list-disc pr-6 space-y-2">
                <li>تتم معالجة الطلبات خلال ١-٣ أيام عمل.</li>
                <li>مدة الشحن تختلف حسب المدينة ووسيلة التوصيل.</li>
                <li>
                  لا يتحمل المتجر مسؤولية التأخير الناتج عن شركات الشحن أو
                  الظروف الطارئة.
                </li>
                <li>العميل مسؤول عن توفير عنوان صحيح وكامل للتوصيل.</li>
              </ul>
            </div>
          </section>

          {/* 6. سياسة الإرجاع */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ٦. سياسة الإرجاع والاستبدال
            </h2>
            <p>نسعى لرضاك التام، وإليك سياسة الإرجاع والاستبدال:</p>
            <div className="p-6 text-gray-600 dark:text-gray-300">
              <ul className="list-disc pr-6 space-y-2">
                <li>
                  يمكن استرجاع أو استبدال المنتج خلال{" "}
                  <strong className="font-extrabold">24 ساعه</strong> فقط من
                  تاريخ الاستلام.
                </li>
                <li>
                  يجب أن يكون المنتج بحالته الأصلية غير مستخدم وغير مغسول.
                </li>
                <li>
                  العميل يتحمل تكاليف الشحن في حال الرغبة في الإرجاع إلا إذا كان
                  المنتج معيباً.
                </li>
                <li className="font-bold text-amber-500">
                  المنتجات المصممة خصيصاً (Custom) لا تشملها سياسة الإرجاع إلا
                  في حال وجود عيب مصنعي.
                </li>
              </ul>
            </div>
          </section>

          {/* 7. الاستخدام الممنوع */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ٧. الاستخدام الممنوع
            </h2>
            <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
              <p>لضمان بيئة آمنة للجميع، يمنع القيام بالأمور التالية:</p>
              <ul className="list-disc pr-6 space-y-2">
                <li>
                  يحظر استخدام الموقع في أي أنشطة غير قانونية أو احتيالية.
                </li>
                <li>
                  يمنع محاولة اختراق الموقع أو التلاعب بالبيانات أو استغلال
                  الثغرات.
                </li>
                <li>
                  يحق للمتجر اتخاذ إجراءات قانونية ضد أي شخص يخالف هذه القواعد.
                </li>
                <li>
                  يمكن الإبلاغ عن أي سلوك مشبوه عبر البريد الإلكتروني الرسمي.
                </li>
              </ul>
            </div>
          </section>

          {/* 8. الملكية الفكرية */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ٨. الملكية الفكرية
            </h2>
            <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
              <p>جميع محتويات الموقع محمية بحقوق الملكية الفكرية.</p>
              <ul className="list-disc pr-6 space-y-2">
                <li>
                  جميع محتويات الموقع (النصوص، الصور، التصاميم، الشعار) مملوكة
                  لمتجر {STORE_INFO.NAME}.
                </li>
                <li>
                  لا يجوز نسخ أو إعادة نشر أو استخدام أي محتوى لأغراض تجارية دون
                  إذن خطي مسبق.
                </li>
                <li>
                  التصاميم والعروض الفنية محمية بقوانين الملكية الفكرية الدولية.
                </li>
              </ul>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-sm text-amber-500">
                <strong>ملاحظة:</strong> جميع تصاميمنا مسجلة ومحمية قانونياً. أي
                محاولة للتقليد أو النسخ ستتعرض للملاحقة القانونية.
              </div>
            </div>
          </section>

          {/* 9. حماية البيانات */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ٩. حماية البيانات
            </h2>
            <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
              <p>نحن نحمي خصوصيتك وبياناتك الشخصية.</p>
              <ul className="list-disc pr-6 space-y-2">
                <li>يحترم المتجر خصوصية عملائه ويضمن حماية بياناتهم.</li>
                <li>
                  يتم استخدام البيانات الشخصية فقط لمعالجة الطلبات والتوصيل
                  والتواصل مع العميل.
                </li>
                <li>
                  لا تتم مشاركة بيانات العملاء مع أي طرف ثالث إلا في حال الضرورة
                  (مثل شركات الشحن).
                </li>
                <li>
                  يمكنك طلب حذف بياناتك الشخصية في أي وقت عبر التواصل معنا.
                </li>
              </ul>
            </div>
          </section>

          {/* 10. القانون والاختصاص القضائي */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ١٠. القانون والاختصاص القضائي
            </h2>
            <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
              <p>تخضع علاقتنا للقوانين والأنظمة المعمول بها.</p>
              <ul className="list-disc pr-6 space-y-2">
                <li>
                  تخضع هذه الأحكام والشروط لأنظمة وقوانين المملكة العربية
                  السعودية.
                </li>
                <li>
                  في حال حدوث أي نزاع، تكون الجهة القضائية المختصة هي المحاكم في
                  المملكة العربية السعودية.
                </li>
                <li>نحن نؤمن بحل النزاعات ودياً قبل اللجوء إلى القضاء.</li>
              </ul>
            </div>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-10 md:mt-20 pt-10 text-center">
          <p className="text-black dark:text-white text-xl md:text-3xl lg:text-5xl font-black leading-tight">
            شكراً لثقتكم بمتجر {STORE_INFO.NAME}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
