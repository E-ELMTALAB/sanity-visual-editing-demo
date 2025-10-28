"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4"
      dir="rtl"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59,130,246,0.08) 1px, transparent 0)`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 space-x-reverse group">
            <img
              src="/images/design-mode/group-1-1.png"
              alt="SharifGPT Logo"
              className="w-12 h-12 rounded-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <h1 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
              SharifGPT
            </h1>
          </Link>
          <p className="text-slate-600 mt-2 text-sm">
            {isLogin ? "به حساب کاربری خود وارد شوید" : "حساب کاربری جدید ایجاد کنید"}
          </p>
        </div>

        {/* Login/Register Form */}
        <div className="glassmorphism-light rounded-2xl p-8 shadow-xl backdrop-blur-xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Toggle Buttons */}
            <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isLogin ? "bg-blue-600 text-white shadow-lg" : "text-slate-600 hover:text-slate-800 hover:bg-white/50"
                }`}
              >
                ورود
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  !isLogin
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-600 hover:text-slate-800 hover:bg-white/50"
                }`}
              >
                ثبت نام
              </button>
            </div>

            {/* Name Field (Register Only) */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 text-sm font-medium">
                  نام و نام خانوادگی
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-white/70 border-slate-200 text-slate-800 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-12"
                  placeholder="نام خود را وارد کنید"
                  required={!isLogin}
                />
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 text-sm font-medium">
                ایمیل
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-white/70 border-slate-200 text-slate-800 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-12"
                placeholder="example@email.com"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 text-sm font-medium">
                رمز عبور
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="bg-white/70 border-slate-200 text-slate-800 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-12"
                placeholder="رمز عبور خود را وارد کنید"
                required
              />
            </div>

            {/* Confirm Password Field (Register Only) */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700 text-sm font-medium">
                  تکرار رمز عبور
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="bg-white/70 border-slate-200 text-slate-800 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-12"
                  placeholder="رمز عبور را مجدداً وارد کنید"
                  required={!isLogin}
                />
              </div>
            )}

            {/* Forgot Password Link (Login Only) */}
            {isLogin && (
              <div className="text-left">
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-300"
                >
                  رمز عبور را فراموش کرده‌اید؟
                </Link>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl h-12"
            >
              {isLogin ? "ورود به حساب کاربری" : "ایجاد حساب کاربری"}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">یا</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full bg-white/70 border-slate-200 text-slate-700 hover:bg-white hover:text-slate-800 rounded-xl h-12 transition-all duration-300"
              >
                <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                ادامه با Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full bg-white/70 border-slate-200 text-slate-700 hover:bg-white hover:text-slate-800 rounded-xl h-12 transition-all duration-300"
              >
                <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V21.88A10.001 10.001 0 0012 2z" />
                </svg>
                ادامه با Facebook
              </Button>
            </div>
          </form>

          {/* Terms and Privacy */}
          <div className="mt-6 text-center text-xs text-slate-500">
            با {isLogin ? "ورود" : "ثبت نام"} شما با{" "}
            <Link href="/terms" className="text-blue-600 hover:text-blue-700 transition-colors">
              قوانین و مقررات
            </Link>{" "}
            و{" "}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-700 transition-colors">
              سیاست حریم خصوصی
            </Link>{" "}
            موافقت می‌کنید.
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 space-x-reverse text-slate-600 hover:text-slate-800 transition-colors duration-300 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m0 7h18" />
            </svg>
            <span>بازگشت به صفحه اصلی</span>
          </Link>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-200/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-cyan-200/20 rounded-full blur-xl animate-pulse delay-500"></div>
    </div>
  )
}
