import { BookOpen, Users, Trophy, Zap, Star, ArrowRight, Play, Target, Award } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-[calc(100dvh-64px)]">
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-white/10 rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-40 right-1/3 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-700"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 animate-bounce">
              <BookOpen className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight text-balance">
              Learn. Play.
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Level Up.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl md:text-2xl opacity-90 max-w-3xl mx-auto text-balance leading-relaxed">
              A gamified learning journey designed especially for students from rural areas — interactive lessons, fun
              quizzes, and practical game-like challenges that make STEM learning exciting.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4">
              <div className="flex justify-center items-center gap-4">
                <a
                  href="/signup"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-white text-indigo-700 font-bold px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <Play className="w-5 h-5" />
                  Start Learning Now
                </a>
                <a
                  href="/signin"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border-2 border-white/70 text-white font-bold px-8 py-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <ArrowRight className="w-5 h-5" />I have an account
                </a>
              </div>
              <div className="animate-bounce mt-5">
                <a
                  href="/games"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 text-black font-bold px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <Play className="w-5 h-5" />
                  Start your gaming adventure!
                </a>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>10,000+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>500+ Lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span>50+ Subjects</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose EduManthan?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto text-balance">
              We make learning fun, accessible, and rewarding for every student, especially those in rural areas with
              limited resources.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Interactive Lessons</h3>
              <p className="text-gray-600 leading-relaxed">
                Engaging visuals, stories, and interactive content make complex STEM concepts easy to understand and
                remember.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Gamified Learning</h3>
              <p className="text-gray-600 leading-relaxed">
                Earn XP, unlock badges, level up, and compete with friends. Learning becomes an exciting adventure, not
                a chore.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Practical Challenges</h3>
              <p className="text-gray-600 leading-relaxed">
                Apply what you learn through hands-on games and real-world challenges that build practical
                problem-solving skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto text-balance">
              Simple steps to start your learning journey and achieve your academic goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Sign Up</h3>
              <p className="text-gray-600 text-sm">Create your account and tell us your grade level</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Choose Subjects</h3>
              <p className="text-gray-600 text-sm">Pick from AI-generated subjects tailored to your level</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Complete Missions</h3>
              <p className="text-gray-600 text-sm">Learn, quiz, and play through engaging 3-level missions</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                4
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Level Up</h3>
              <p className="text-gray-600 text-sm">Earn XP, unlock achievements, and track your progress</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Learn Together, Grow Together</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Join our vibrant community where students help each other solve problems, share knowledge, and celebrate
                achievements. Ask questions, get answers, and make learning a collaborative journey.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Peer-to-peer Q&A support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Share and discuss solutions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700">Earn reputation by helping others</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold">R</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">Rahul Kumar</p>
                    <p className="text-gray-600 text-sm mt-1">
                      Can someone help me with this physics problem about motion?
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>5 replies</span>
                      <span>2 hours ago</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">P</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">Priya Singh</p>
                    <p className="text-gray-600 text-sm mt-1">
                      Just completed the chemistry mission! The experiments were amazing.
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>12 likes</span>
                      <span>1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Transform Your Learning?</h2>
          <p className="text-lg sm:text-xl opacity-90 mb-10 text-balance">
            Join thousands of students who are already making learning fun and achieving their dreams with EduManthan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/signup"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-white text-indigo-700 font-bold px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Zap className="w-5 h-5" />
              Start Your Journey
            </a>
            <p className="text-sm opacity-75">Free to join • No credit card required</p>
          </div>
        </div>
      </section>
    </main>
  )
}
