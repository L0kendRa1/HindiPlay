import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogIn, ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSuccess: () => void;
  onBack: () => void;
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onBack,
  onSwitchToRegister,
}) => {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('कृपया ईमेल और पासवर्ड दोनों दर्ज करें।');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await login(email.trim(), password);
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);

      if (msg.includes('Network') || msg.includes('Failed to fetch') || msg.includes('Unable to reach')) {
        setErrorMessage('सर्वर से कनेक्शन नहीं हो सका। कृपया बाद में फिर कोशिश करें।');
      } else if (msg.includes('Invalid') || msg.includes('password') || msg.includes('401')) {
        setErrorMessage('ईमेल या पासवर्ड गलत है। कृपया पुनः प्रयास करें।');
      } else {
        setErrorMessage(msg || 'लॉगिन में त्रुटि हुई। कृपया पुनः प्रयास करें।');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-toy-canvas flex flex-col justify-between items-center px-4 py-8 font-hindi select-none">
      {/* Top Bar with Back Button */}
      <div className="w-full max-w-md flex items-center justify-start">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex items-center gap-1.5 bg-white border-2 border-slate-200 text-slate-700 px-3.5 py-2 rounded-2xl font-black text-xs md:text-sm shadow-toy-sm hover:border-toy-sky hover:text-toy-blue active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>वापस</span>
        </button>
      </div>

      {/* Main Form Card */}
      <div className="w-full max-w-md bg-white rounded-3xl border-4 border-toy-sky p-6 sm:p-8 shadow-toy-xl animate-pop-in my-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-toy-sky to-toy-blue flex items-center justify-center text-white text-3xl shadow-toy-md mb-3">
            🔑
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
            लॉगिन करें
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">
            अपनी सीखने की प्रगति जारी रखें
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs sm:text-sm font-bold animate-shake">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email Field */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs sm:text-sm font-extrabold text-slate-700">
              ईमेल (Email)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="आपका ईमेल दर्ज करें"
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-toy-sky bg-slate-50 text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-colors"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs sm:text-sm font-extrabold text-slate-700">
              पासवर्ड (Password)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="पासवर्ड दर्ज करें"
                disabled={isSubmitting}
                className="w-full pl-4 pr-11 py-3 rounded-2xl border-2 border-slate-200 focus:border-toy-sky bg-slate-50 text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title={showPassword ? 'पासवर्ड छुपाएँ' : 'पासवर्ड देखें'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-toy-sky to-toy-blue text-white text-base sm:text-lg font-black shadow-toy-md hover:shadow-toy-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin text-lg">⏳</span>
                <span>जाँच हो रही है...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 stroke-[2.5]" />
                <span>लॉगिन करें</span>
              </>
            )}
          </button>
        </form>

        {/* Switch to Register link */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs sm:text-sm font-bold text-slate-500">
            खाता नहीं है?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              disabled={isSubmitting}
              className="text-toy-blue font-black underline underline-offset-2 hover:text-sky-700 ml-1"
            >
              नया खाता बनाएँ
            </button>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 font-medium">
        हिंदी बाल मंच • सुरक्षित लॉगिन
      </footer>
    </div>
  );
};
