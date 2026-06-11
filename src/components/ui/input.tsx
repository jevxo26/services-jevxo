import * as React from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        data-slot="input"
        className={cn(
          "flex h-11 w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/10 focus-visible:border-rose-400/80 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export interface PremiumSearchProps extends Omit<React.ComponentProps<"input">, "onChange"> {
  value?: string
  onChange?: (value: string) => void
  resultsCount?: number
  containerClassName?: string
}

const PremiumSearch = React.forwardRef<HTMLInputElement, PremiumSearchProps>(
  ({ className, value = "", onChange, placeholder = "Search...", resultsCount, containerClassName, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState(value)

    React.useEffect(() => {
      setInputValue(value)
    }, [value])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      setInputValue(val)
      if (onChange) {
        onChange(val)
      }
    }

    const handleClear = () => {
      setInputValue("")
      if (onChange) {
        onChange("")
      }
    }

    return (
      <div
        className={cn(
          "relative flex items-center w-full h-11 rounded-full border border-slate-100 bg-white px-4 shadow-sm hover:shadow-md focus-within:shadow-md focus-within:border-rose-400 focus-within:ring-4 focus-within:ring-rose-500/5 transition-all duration-300 ease-out",
          containerClassName
        )}
      >
        {/* Left Search Icon */}
        <Search className="text-slate-400 mr-2.5 transition-colors group-focus-within:text-rose-500" size={18} />

        {/* Input Field */}
        <input
          type="text"
          ref={ref}
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={cn(
            "flex-1 bg-transparent border-0 p-0 text-sm font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-0 min-w-0",
            className
          )}
          {...props}
        />

        {/* Right Section: Clear Button & Results Indicator */}
        <div className="flex items-center gap-2.5 ml-2 select-none shrink-0">
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}

          {typeof resultsCount === "number" && (
            <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100/60">
              {resultsCount} {resultsCount === 1 ? "result" : "results"}
            </span>
          )}
        </div>
      </div>
    )
  }
)
PremiumSearch.displayName = "PremiumSearch"

export { Input, PremiumSearch }
