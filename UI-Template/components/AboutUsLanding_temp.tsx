      <section id="section-free-tests" className="py-20 bg-gradient-to-br from-white via-orange-50 to-red-50">
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full text-sm mb-6 shadow-lg">
              <Trophy className="size-4" />
              <span className="font-medium">🎁 Thi thử miễn phí - Không cần thanh toán</span>
            </div>
            <h2 className="text-5xl mb-6">
              Trải nghiệm <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-bold">VSTEP thật 100%</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
              Đăng ký tài khoản Free ngay hôm nay để nhận <span className="font-bold text-orange-600">5 đề thi chuẩn VSTEP</span> và <span className="font-bold text-orange-600">10 lượt thi miễn phí/tháng</span>. Trải nghiệm giao diện thi như thật, chấm điểm tự động Reading & Listening!
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="size-5 text-green-600" />
                <span>Không cần thẻ tín dụng</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-5 text-green-600" />
                <span>Miễn phí mãi mãi</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-5 text-green-600" />
                <span>Đăng ký 30 giây</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Giao diện thi thật 100%',
                description: 'Mô phỏng chính xác môi trường thi VSTEP thực tế với đồng hồ đếm ngược, navigation bar và trải nghiệm như thi tại trung tâm',
                icon: Trophy,
                color: 'from-orange-500 to-red-500',
                badge: 'Giống thật',
                features: ['Đồng hồ đếm ngược', 'Điều hướng câu hỏi', 'Giao diện chuẩn']
              },
              {
                title: 'Chấm điểm tức thì',
                description: 'Hệ thống AI chấm điểm Reading & Listening tự động ngay sau khi nộp bài. Xem đáp án, giải thích chi tiết từng câu hỏi',
                icon: Zap,
                color: 'from-blue-500 to-cyan-500',
                badge: 'AI Smart',
                features: ['Kết quả tức thì', 'Giải thích đáp án', 'Phân tích lỗi sai']
              },
              {
                title: '5 đề thi chuẩn VSTEP',
                description: 'Truy cập miễn phí 5 đề thi được biên soạn bởi giảng viên 15 năm kinh nghiệm, cập nhật theo format VSTEP mới nhất 2025',
                icon: BookOpen,
                color: 'from-purple-500 to-pink-500',
                badge: 'Chuẩn 2025',
                features: ['Đề thi từ A2-C1', '4 kỹ năng đầy đủ', 'Format mới nhất']
              }
            ].map((test, idx) => (
              <div key={idx} className="group relative bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-orange-300 overflow-hidden hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 bg-gradient-to-r ${test.color} text-white shadow-md`}>
                  {test.badge}
                </div>

                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${test.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}>
                  <test.icon className="size-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-600 transition-colors">{test.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{test.description}</p>
                
                <div className="space-y-2 mb-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4">
                  {test.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="size-4 text-orange-600 shrink-0 mt-0.5" />
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400 to-red-600 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity"></div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white opacity-10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm mb-6">
                  <Sparkles className="size-4" />
                  <span className="font-medium">Đã có 50,000+ học viên đăng ký</span>
                </div>
                <h3 className="text-4xl font-bold text-white mb-4">
                  Sẵn sàng chinh phục VSTEP?
                </h3>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Tạo tài khoản miễn phí ngay để bắt đầu hành trình luyện thi VSTEP hiệu quả cùng VSTEPRO!
                </p>
                <button 
                  onClick={() => setShowFreeRegisterModal(true)}
                  className="inline-flex items-center gap-3 px-10 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <Trophy className="size-6" />
                  Đăng ký miễn phí ngay
                  <ArrowRight className="size-6" />
                </button>
                <p className="text-white/80 text-sm mt-4">
                  ⚡ Chỉ mất 30 giây • Không cần thẻ tín dụng • Miễn phí mãi mãi
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
