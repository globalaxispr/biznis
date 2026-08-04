import { FileQuestion } from "lucide-react"
import { Button } from "../components/ui/button"
import { Link } from "react-router-dom"

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-6 text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <FileQuestion className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-4xl font-bold text-neutral-900 mb-2">Paj la pa jwenn (404)</h1>
      <p className="text-neutral-500 max-w-md mb-8">
        Eskize nou, paj wap chèche a pa egziste oswa li te deplase. 
        Tanpri tcheke adrès la oswa retounen nan paj akèy la.
      </p>
      <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl">
        <Link to="/">Retounen nan Akèy</Link>
      </Button>
    </div>
  )
}
