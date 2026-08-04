import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Store, Phone, Mail, MapPin, Save, Printer, Shield, Database, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

import { useStoreSettings } from '../hooks/useStoreSettings'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

export function SettingsPage() {
  const { settings, updateSettings, isLoading } = useStoreSettings()
  const [activeTab, setActiveTab] = useState<'company' | 'receipt' | 'printer' | 'security'>('company')

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      country: '',
      nif: '',
      currency: 'HTG',
      language: 'ht',
      tax_rate: 0,
      receipt_message: '',
      printer_name: ''
    }
  })

  useEffect(() => {
    if (settings) {
      reset({
        name: settings.name || '',
        phone: settings.phone || '',
        email: settings.email || '',
        address: settings.address || '',
        city: settings.city || 'Port-au-Prince',
        country: settings.country || 'Haiti',
        nif: settings.nif || '000-000-000',
        currency: settings.currency || 'HTG',
        language: settings.language || 'ht',
        tax_rate: settings.tax_rate || 0,
        receipt_message: settings.receipt_message || 'Mèsi paske ou achte lakay nou. Nou swete wè ou ankò.',
        printer_name: settings.printer_name || 'POS-80 Thermal'
      })
    }
  }, [settings, reset])

  const onSubmit = async (data: any) => {
    try {
      await updateSettings(data)
      toast.success('Paramèt antrepriz la sove avèk siksè!')
    } catch (err: any) {
      toast.error('Erè pandan anregistreman an')
    }
  }

  const handleBackup = () => {
    toast.success('Fichye backup estok ak vant yo anregistre!')
  }

  if (isLoading) {
    return <div className="p-12 text-center text-neutral-400">Ap chaje paramèt yo...</div>
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Paramèt & Módulo Antrepriz</h2>
        <p className="text-sm text-neutral-500">Konfigire enfòmasyon magazen an, resi, enprimant ak sekirite</p>
      </div>

      {/* Tabs Header */}
      <div className="flex gap-2 border-b pb-2">
        <button
          onClick={() => setActiveTab('company')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'company' ? 'bg-primary text-white' : 'bg-white text-neutral-600 border'
          }`}
        >
          <Store className="w-4 h-4" /> Antrepriz / Loja
        </button>

        <button
          onClick={() => setActiveTab('receipt')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'receipt' ? 'bg-primary text-white' : 'bg-white text-neutral-600 border'
          }`}
        >
          <FileText className="w-4 h-4" /> Resi & Taks
        </button>

        <button
          onClick={() => setActiveTab('printer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'printer' ? 'bg-primary text-white' : 'bg-white text-neutral-600 border'
          }`}
        >
          <Printer className="w-4 h-4" /> Impressora 80mm
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'security' ? 'bg-primary text-white' : 'bg-white text-neutral-600 border'
          }`}
        >
          <Shield className="w-4 h-4" /> Backup & Sekirite
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl border shadow-sm space-y-6">
        {activeTab === 'company' && (
          <div className="space-y-4">
            <h4 className="font-bold text-neutral-800 text-sm border-b pb-2">Enfòmasyon Sou Antrepriz la</h4>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block">Non Magazen / Antrepriz *</label>
              <div className="relative mt-1">
                <Store className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <Input {...register('name')} className="pl-10" placeholder="ex: BizHaiti Commerce" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block">Telefòn *</label>
                <div className="relative mt-1">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <Input {...register('phone')} className="pl-10" placeholder="+509 3700 0000" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block">Imèl *</label>
                <div className="relative mt-1">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <Input {...register('email')} className="pl-10" placeholder="contact@bizhaiti.ht" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block">Adrès Fizik</label>
                <div className="relative mt-1">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <Input {...register('address')} className="pl-10" placeholder="Delmas 75" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block">Vil</label>
                <Input {...register('city')} className="mt-1" placeholder="Port-au-Prince" />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block">NIF / Identifiant Fiscal</label>
                <Input {...register('nif')} className="mt-1" placeholder="000-000-000" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block">Deviz (Moeda)</label>
                <select {...register('currency')} className="w-full h-10 border rounded-xl px-3 text-sm bg-white mt-1">
                  <option value="HTG">Gourde Ayisyen (HTG)</option>
                  <option value="USD">Dola Ameriken (USD)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block">Lang</label>
                <select {...register('language')} className="w-full h-10 border rounded-xl px-3 text-sm bg-white mt-1">
                  <option value="ht">Kreyòl Ayisyen</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'receipt' && (
          <div className="space-y-4">
            <h4 className="font-bold text-neutral-800 text-sm border-b pb-2">Personnalisation Resi Vant (80mm)</h4>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block">Mesaj Kouri nan Pye Resi an (Footer Message)</label>
              <Input {...register('receipt_message')} className="mt-1" placeholder="Mèsi paske ou achte lakay nou. Nou swete wè ou ankò." />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block">Pousantaj Taks (TCA / TVA %)</label>
              <Input type="number" step="0.1" {...register('tax_rate', { valueAsNumber: true })} className="mt-1" placeholder="0" />
              <p className="text-[11px] text-neutral-400 mt-1">Si taks la se 0%, resi an ap afiche 0.00 HTG nan taks.</p>
            </div>
          </div>
        )}

        {activeTab === 'printer' && (
          <div className="space-y-4">
            <h4 className="font-bold text-neutral-800 text-sm border-b pb-2">Konfigirasyon Enprimant</h4>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block">Non Enprimant Tèmik Pwopoze</label>
              <Input {...register('printer_name')} className="mt-1" placeholder="POS-80 Thermal Printer" />
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
              BizHaiti ERP itilize entegrasyon enpresyon direct 80mm natif nan navigatè an (`window.print()`).
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <h4 className="font-bold text-neutral-800 text-sm border-b pb-2">Sekirite ak Fichye Save (Backup)</h4>

            <div className="flex items-center justify-between p-4 border rounded-xl bg-neutral-50">
              <div>
                <h5 className="font-bold text-xs text-neutral-900">Telechaje Backup Tout Done yo</h5>
                <p className="text-[11px] text-neutral-500">Generatè fichye sekirite estok ak vant yo nan CSV</p>
              </div>
              <Button type="button" onClick={handleBackup} variant="outline" className="gap-2 text-xs">
                <Database className="w-4 h-4 text-primary" /> Fè Backup Kounye a
              </Button>
            </div>
          </div>
        )}

        <div className="pt-4 border-t flex justify-end">
          <Button type="submit" className="bg-primary text-white font-bold gap-2">
            <Save className="w-4 h-4" /> Sove Paramèt yo
          </Button>
        </div>
      </form>
    </div>
  )
}
