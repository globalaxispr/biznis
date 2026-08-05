import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Loader2, Mail, Lock, ShieldCheck, BarChart3, Zap } from "lucide-react"
import toast from "react-hot-toast"
import { motion, type Variants } from "framer-motion"

import { Input } from "../components/ui/input"
import { useAuth } from "../providers/AuthProvider"
import { AuthRepository } from "../repositories/AuthRepository"

// ─── Validation Schema (unchanged) ──────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email("Tanpri antre yon imèl ki valab"),
  password: z.string().min(6, "Modpas la dwe gen omwen 6 karaktè"),
  rememberMe: z.boolean().optional()
})

type LoginFormValues = z.infer<typeof loginSchema>

// ─── Kay Nephy Logo SVG ──────────────────────────────────────────────────────
function KayNephyLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 160"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Kay Nephy"
    >
      {/* Swoosh orange bottom */}
      <path
        d="M20 115 Q55 80 80 100 Q110 120 140 95 Q160 80 155 110"
        stroke="#F07823"
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
      />
      {/* Swoosh orange top */}
      <path
        d="M45 95 Q75 65 100 80 Q125 95 135 75"
        stroke="#F07823"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      {/* Leaf green */}
      <path
        d="M90 30 Q100 10 115 20 Q130 30 118 55 Q105 65 90 50 Q80 40 90 30Z"
        fill="#2E7D52"
      />
      {/* Stem */}
      <line x1="104" y1="45" x2="104" y2="72" stroke="#2E7D52" strokeWidth="5" strokeLinecap="round"/>

      {/* KAY text */}
      <text x="155" y="68" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="800" fontSize="28" fill="#F07823" letterSpacing="2">KAY</text>

      {/* NEPHY text */}
      <text x="155" y="115" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="900" fontSize="52" fill="#2E7D52" letterSpacing="1">NEPHY</text>

      {/* Dots on Y */}
      <circle cx="357" cy="72" r="7" fill="#F07823"/>
      <circle cx="373" cy="82" r="5" fill="#2E7D52"/>
    </svg>
  )
}

// ─── Benefits data ───────────────────────────────────────────────────────────
const benefits = [
  {
    icon: ShieldCheck,
    title: "Sekirite Avanse",
    description: "Done ou yo pwoteje ak sekirite avanse.",
  },
  {
    icon: BarChart3,
    title: "Jesyon Konplè",
    description: "Tout sa w bezwen pou jere biznis ou.",
  },
  {
    icon: Zap,
    title: "Fasil & Rapid",
    description: "Entèfas senp, rapò rapid, desizyon pi bon.",
  },
]

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.08 },
  }),
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

// ─── Component ───────────────────────────────────────────────────────────────
export function Login() {
  const { refreshSession } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const emailInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
  })

  useEffect(() => {
    emailInputRef.current?.focus()
  }, [])

  // ── Submit handler (unchanged logic) ────────────────────────────────────
  const onSubmit = async (data: LoginFormValues) => {
    console.log('[DEBUG-FLOW] Login.tsx:Linha 48 - Login iniciado com email:', data.email)
    try {
      const signInResult = await AuthRepository.signIn(data.email, data.password)
      console.log('[DEBUG-FLOW] Login.tsx:Linha 51 - Login concluído no AuthRepository. Resultado interno:', !!signInResult)

      console.log('[DEBUG-FLOW] Login.tsx:Linha 54 - Chamando refreshSession()')
      await refreshSession()
      console.log('[DEBUG-FLOW] Login.tsx:Linha 56 - refreshSession() finalizado. Redirecionamento deve ocorrer via AppRoutes')

      toast.success("Byenvini nan Kay Nephy!")
    } catch (error: any) {
      console.error('[DEBUG-FLOW] Login.tsx:Linha 60 - ERRO NO LOGIN:', error)
      toast.error(error.message || "Imèl oswa modpas pa bon")
    }
  }

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">

      {/* ══════════════════════════════════════════════════
          LEFT PANEL  (40%) — Marketing / Brand
      ══════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden lg:flex lg:w-[42%] xl:w-[40%] flex-col relative overflow-hidden"
        style={{ backgroundColor: "#0D1D25" }}
      >
        {/* Decorative shapes */}
        <div
          className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full opacity-[0.07]"
          style={{ backgroundColor: "#D59D80" }}
        />
        <div
          className="absolute bottom-0 -right-20 w-[320px] h-[320px] rounded-full opacity-[0.06]"
          style={{ backgroundColor: "#104C64" }}
        />
        <div
          className="absolute top-1/2 -right-10 w-[200px] h-[200px] rounded-full opacity-[0.05]"
          style={{ backgroundColor: "#C0754D" }}
        />
        {/* Orange accent line */}
        <div
          className="absolute left-0 top-0 h-full w-[3px]"
          style={{
            background: "linear-gradient(180deg, transparent 0%, #D59D80 30%, #C0754D 70%, transparent 100%)",
          }}
        />
        {/* Dot grid pattern */}
        <svg
          className="absolute top-20 right-10 opacity-10"
          width="120"
          height="120"
          viewBox="0 0 120 120"
        >
          {Array.from({ length: 6 }, (_, row) =>
            Array.from({ length: 6 }, (_, col) => (
              <circle key={`${row}-${col}`} cx={col * 20 + 10} cy={row * 20 + 10} r="1.5" fill="#C6C6D0" />
            ))
          )}
        </svg>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-12 py-14">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <KayNephyLogo className="w-52 h-auto brightness-0 invert" />
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="origin-left mt-10 mb-8 h-px w-10"
            style={{ backgroundColor: "#D59D80" }}
          />

          {/* Headline */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <h1 className="text-3xl xl:text-4xl font-bold leading-tight text-white">
              Kay Nephy{" "}
              <span style={{ color: "#D59D80" }}>ERP</span>
            </h1>
            <p className="mt-2 text-base font-semibold" style={{ color: "#C6C6D0" }}>
              Sistèm jesyon biznis entèlijan
            </p>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="mt-6 text-sm leading-relaxed"
            style={{ color: "#C6C6D0", opacity: 0.75 }}
          >
            Jere pwodwsi, lavant, kliyan, founisè,
            <br />
            envantè ak rapò ou yo an yon sèl platfòm.
          </motion.p>

          {/* Benefits */}
          <div className="mt-10 space-y-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={5 + i}
                className="flex items-start gap-4"
              >
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(213,157,128,0.12)", border: "1px solid rgba(213,157,128,0.2)" }}
                >
                  <b.icon className="w-5 h-5" style={{ color: "#D59D80" }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{b.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#C6C6D0", opacity: 0.7 }}>
                    {b.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={9}
            className="mt-auto text-xs"
            style={{ color: "#C6C6D0", opacity: 0.4 }}
          >
            © 2025 Kay Nephy. Tout dwa rezève.
          </motion.p>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════
          RIGHT PANEL  (60%) — Login Form
      ══════════════════════════════════════════════════ */}
      <div
        className="flex-1 flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24"
        style={{ backgroundColor: "#F8F8FA" }}
      >
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* ── Card ── */}
          <div
            className="bg-white w-full rounded-[24px] px-8 py-10 sm:px-10 sm:py-12"
            style={{
              boxShadow:
                "0 0 0 1px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.07), 0 32px 64px rgba(0,0,0,0.05)",
            }}
          >
            {/* Logo inside card */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="flex justify-center mb-8"
            >
              <KayNephyLogo className="h-14 w-auto" />
            </motion.div>

            {/* Title */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-center mb-8"
            >
              <h2
                className="text-[28px] font-bold tracking-tight"
                style={{ color: "#0D1D25" }}
              >
                Konekte
              </h2>
              <p className="mt-2 text-sm" style={{ color: "#8A8A9A" }}>
                Antre enfòmasyon ou pou konekte nan sistèm nan.
              </p>
            </motion.div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

              {/* Email */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={3}
                className="space-y-2"
              >
                <label
                  htmlFor="login-email"
                  className="block text-sm font-semibold"
                  style={{ color: "#0D1D25" }}
                >
                  Imèl
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px]"
                    style={{ color: "#B0B0C0" }}
                  />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    aria-label="Imèl"
                    aria-describedby={errors.email ? "email-error" : undefined}
                    placeholder="Antre imèl ou"
                    {...register("email")}
                    className="w-full pl-11 pr-4 text-sm font-medium transition-all duration-200 outline-none"
                    style={{
                      height: "56px",
                      borderRadius: "16px",
                      border: errors.email
                        ? "1.5px solid #ef4444"
                        : "1.5px solid #E4E4EF",
                      backgroundColor: "#FAFAFA",
                      color: "#0D1D25",
                    }}
                    onFocus={(e) => {
                      if (!errors.email) {
                        e.currentTarget.style.border = "1.5px solid #104C64"
                        e.currentTarget.style.backgroundColor = "#fff"
                        e.currentTarget.style.boxShadow = "0 0 0 4px rgba(16,76,100,0.08)"
                      }
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = errors.email
                        ? "1.5px solid #ef4444"
                        : "1.5px solid #E4E4EF"
                      e.currentTarget.style.backgroundColor = "#FAFAFA"
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="text-xs font-medium text-red-500 pl-1">
                    {errors.email.message}
                  </p>
                )}
              </motion.div>

              {/* Password */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={4}
                className="space-y-2"
              >
                <label
                  htmlFor="login-password"
                  className="block text-sm font-semibold"
                  style={{ color: "#0D1D25" }}
                >
                  Modpas
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px]"
                    style={{ color: "#B0B0C0" }}
                  />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    aria-label="Modpas"
                    aria-describedby={errors.password ? "password-error" : undefined}
                    placeholder="Antre modpas ou"
                    {...register("password")}
                    className="w-full pl-11 pr-12 text-sm font-medium transition-all duration-200 outline-none"
                    style={{
                      height: "56px",
                      borderRadius: "16px",
                      border: errors.password
                        ? "1.5px solid #ef4444"
                        : "1.5px solid #E4E4EF",
                      backgroundColor: "#FAFAFA",
                      color: "#0D1D25",
                    }}
                    onFocus={(e) => {
                      if (!errors.password) {
                        e.currentTarget.style.border = "1.5px solid #104C64"
                        e.currentTarget.style.backgroundColor = "#fff"
                        e.currentTarget.style.boxShadow = "0 0 0 4px rgba(16,76,100,0.08)"
                      }
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = errors.password
                        ? "1.5px solid #ef4444"
                        : "1.5px solid #E4E4EF"
                      e.currentTarget.style.backgroundColor = "#FAFAFA"
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Kache modpas" : "Montre modpas"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "#B0B0C0" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#104C64")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#B0B0C0")}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-xs font-medium text-red-500 pl-1">
                    {errors.password.message}
                  </p>
                )}
              </motion.div>

              {/* Remember me + Forgot password */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={5}
                className="flex items-center justify-between pt-1"
              >
                <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      {...register("rememberMe")}
                      className="peer sr-only"
                      id="rememberMe"
                      aria-label="Sonje mwen"
                    />
                    <div
                      className="w-[18px] h-[18px] rounded-md border-2 transition-all duration-200 flex items-center justify-center peer-checked:border-transparent"
                      style={{
                        borderColor: "#D0D0E0",
                      }}
                    >
                      <div className="peer-checked:flex hidden">
                        {/* Filled by CSS peer trick below */}
                      </div>
                    </div>
                    {/* Checkbox overlay using peer */}
                    <div
                      className="absolute inset-0 rounded-md opacity-0 peer-checked:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                      style={{ backgroundColor: "#0D1D25" }}
                    >
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4L3.5 6.5L9 1.5"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="text-sm font-medium" style={{ color: "#5A5A6E" }}>
                    Sonje mwen
                  </span>
                </label>

                <a
                  href="#"
                  className="text-sm font-semibold transition-colors"
                  style={{ color: "#D59D80" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#C0754D")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#D59D80")}
                >
                  Bliye modpas?
                </a>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={6}
                className="pt-3"
              >
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? { scale: 1.015, y: -1 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.985 } : {}}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="w-full flex items-center justify-center gap-3 font-bold text-sm tracking-widest text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{
                    height: "56px",
                    borderRadius: "16px",
                    backgroundColor: "#0D1D25",
                    boxShadow: "0 4px 20px rgba(13,29,37,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) e.currentTarget.style.backgroundColor = "#104C64"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#0D1D25"
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Ap konekte...</span>
                    </>
                  ) : (
                    <>
                      <span>KONEKTE</span>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path
                          d="M3.5 9H14.5M14.5 9L10 4.5M14.5 9L10 13.5"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Bottom notice */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={7}
              className="mt-8 flex flex-col items-center gap-2 text-center"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: "#104C64" }} />
                <span className="text-xs font-semibold" style={{ color: "#104C64" }}>
                  Aksè otorize sèlman
                </span>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: "#A0A0B0" }}>
                Kont itilizatè yo kreye sèlman pa administratè sistèm nan.
              </p>
            </motion.div>
          </div>

          {/* Below card copyright */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={8}
            className="mt-6 text-center text-[11px]"
            style={{ color: "#B0B0C0" }}
          >
            © 2025 Kay Nephy. Tout dwa rezève.
          </motion.p>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════
          MOBILE HEADER (shown only on < lg)
      ══════════════════════════════════════════════════ */}
      <style>{`
        @media (max-width: 1023px) {
          .login-mobile-header {
            display: flex;
          }
        }
      `}</style>
    </div>
  )
}
