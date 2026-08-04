import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ShoppingBag, Eye, EyeOff, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { motion, type Variants } from "framer-motion"

import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { useAuth } from "../providers/AuthProvider"
import { AuthRepository } from "../repositories/AuthRepository"

const loginSchema = z.object({
  email: z.string().email("Tanpri antre yon imèl ki valab"),
  password: z.string().min(6, "Modpas la dwe gen omwen 6 karaktè"),
  rememberMe: z.boolean().optional()
})

type LoginFormValues = z.infer<typeof loginSchema>

export function Login() {
  const { refreshSession } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const emailInputRef = useRef<HTMLInputElement>(null)

  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true
    }
  })

  useEffect(() => {
    // Auto-focus email field on load
    emailInputRef.current?.focus()
  }, [])

  const onSubmit = async (data: LoginFormValues) => {
    console.log('[DEBUG-FLOW] Login.tsx:Linha 48 - Login iniciado com email:', data.email)
    try {
      const signInResult = await AuthRepository.signIn(data.email, data.password)
      console.log('[DEBUG-FLOW] Login.tsx:Linha 51 - Login concluído no AuthRepository. Resultado interno:', !!signInResult)
      
      // Update context strictly from Supabase as per rule 4
      console.log('[DEBUG-FLOW] Login.tsx:Linha 54 - Chamando refreshSession()')
      await refreshSession()
      console.log('[DEBUG-FLOW] Login.tsx:Linha 56 - refreshSession() finalizado. Redirecionamento deve ocorrer via AppRoutes')
      
      toast.success("Byenvini nan BizHaiti!")
    } catch (error: any) {
      console.error('[DEBUG-FLOW] Login.tsx:Linha 60 - ERRO NO LOGIN:', error)
      toast.error(error.message || "Imèl oswa modpas pa bon")
    }
  }

  // Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.1 } }
  }
  
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FDFDFD]">
      {/* Imagem (Left on Desktop, Top on Mobile) */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="h-[35vh] md:h-screen md:w-1/2 relative flex-shrink-0 bg-neutral-100 overflow-hidden"
      >
        {/* Skeleton Loader */}
        {!isImageLoaded && (
          <div className="absolute inset-0 z-0 animate-pulse bg-neutral-200" />
        )}
        
        {/* 25% Escuro Overlay */}
        <div className="absolute inset-0 bg-black/25 z-10" />
        <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#104C64] to-transparent opacity-80 z-10 md:hidden" />
        
        <img 
          src="/bizhaiti_login_bg.png" 
          alt="BizHaiti Merchant" 
          onLoad={() => setIsImageLoaded(true)}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            setIsImageLoaded(true);
          }}
          className={`absolute inset-0 w-full h-full object-cover object-top md:object-center transition-opacity duration-700 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {/* Logo over image on mobile */}
        <div className="absolute bottom-6 left-6 z-20 md:hidden text-white flex items-center gap-2">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">BizHaiti</h1>
            <p className="text-xs font-medium text-white/80">ERP Pwofesyonèl</p>
          </div>
        </div>
      </motion.div>

      {/* Login Form Container */}
      <div className="flex-1 flex items-center justify-center -mt-8 md:mt-0 relative z-20 px-4 md:px-12 py-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md bg-white/80 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none p-8 md:p-0 rounded-[2.5rem] md:rounded-none shadow-2xl md:shadow-none border border-white/40 md:border-none"
        >
          {/* Header (Desktop) */}
          <motion.div variants={itemVariants} className="hidden md:flex flex-col mb-10">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Byenvini</h1>
            <p className="text-neutral-500 mt-2">Konekte pou w jere biznis ou an sekirite.</p>
          </motion.div>
          
          {/* Header (Mobile) */}
          <motion.div variants={itemVariants} className="md:hidden text-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Konekte</h2>
            <p className="text-xs text-neutral-500 mt-1">Antre kòd ou pou w jwenn aksè</p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider pl-1">Imèl (Email)</label>
              <Input 
                {...register("email")}
                autoFocus
                className="h-14 px-4 bg-neutral-50/50 border-neutral-200/80 rounded-2xl focus:bg-white text-base transition-colors"
                placeholder="admin@bizhaiti.com" 
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-medium pl-1">{errors.email.message}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1.5 relative">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider pl-1">Modpas (Password)</label>
              <div className="relative">
                <Input 
                  {...register("password")}
                  type={showPassword ? "text" : "password"} 
                  className="h-14 pl-4 pr-12 bg-neutral-50/50 border-neutral-200/80 rounded-2xl focus:bg-white text-base transition-colors"
                  placeholder="••••••••" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-primary transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-medium pl-1">{errors.password.message}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-between px-1 pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" {...register("rememberMe")} className="peer sr-only" />
                  <div className="w-5 h-5 border-2 border-neutral-300 rounded-md peer-checked:bg-primary peer-checked:border-primary transition-colors"></div>
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900 transition-colors">Sonje mwen</span>
              </label>
              
              <a href="#" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">Bliye modpas?</a>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl text-base shadow-[0_8px_30px_rgb(16,76,100,0.2)] transition-all disabled:opacity-80"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> 
                    Ap konekte...
                  </span>
                ) : (
                  "Konekte"
                )}
              </Button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-xs font-medium text-neutral-400">
              BizHaiti ERP © 2026 • Pwoteje ak chifreman 256-bit
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
