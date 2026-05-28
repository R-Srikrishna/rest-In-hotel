'use client'

import React, { useState } from 'react'
import LoginForm from './ProtectedRoute'
import SignupForm from './ProtectedRoute'

const AuthSlider = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="p-1 bg-slate-200 rounded-full mx-6 mt-6 grid grid-cols-2 gap-1 relative">
          <span
            className={`absolute inset-y-1 w-1/2 rounded-full bg-white shadow transition-all duration-300 ${
              isLogin ? 'left-1' : 'right-1'
            }`}
          />

          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`relative z-10 rounded-full py-3 text-sm font-semibold transition-colors duration-300 ${
              isLogin ? 'text-slate-900' : 'text-slate-500'
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`relative z-10 rounded-full py-3 text-sm font-semibold transition-colors duration-300 ${
              !isLogin ? 'text-slate-900' : 'text-slate-500'
            }`}
          >
            Signup
          </button>
        </div>

        <div className="p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            {isLogin
              ? 'Sign in to continue to your hotel dashboard.'
              : 'Fill in your details to create a new account.'}
          </p>

          {isLogin ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </div>
  )
}

export default AuthSlider
