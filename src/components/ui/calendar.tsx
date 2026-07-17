"use client"

import * as React from "react"
import dayjs, { Dayjs } from "dayjs"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker"

// Create a highly customized, premium theme for Material UI components
const calendarTheme = createTheme({
  palette: {
    primary: {
      main: "#4F46E5", // brand-primary
      light: "#EEF2FF", // brand-bg
      dark: "#E03B40",
      contrastText: "#FFFFFF",
    },
    text: {
      primary: "#0F172A", // premium-slate
      secondary: "#64748B", // premium-gray
    },
  },
  typography: {
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
  },
  components: {
    // Customizing the active picker day cell
    MuiPickersDay: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: "0.825rem",
          borderRadius: "12px",
          color: "#475569",
          transition: "all 0.2s ease-out",
          margin: "2px",
          "&:hover": {
            backgroundColor: "#EEF2FF",
            color: "#4F46E5",
          },
          "&.Mui-selected": {
            background: "linear-gradient(135deg, #4F46E5, #4F46E5)",
            color: "#FFFFFF",
            boxShadow: "0 4px 12px rgba(255, 70, 76, 0.2)",
            "&:hover": {
              background: "linear-gradient(135deg, #4F46E5, #4F46E5)",
              color: "#FFFFFF",
            },
          },
          "&.MuiPickersDay-today": {
            borderColor: "#4F46E5",
            color: "#4F46E5",
            "&.Mui-selected": {
              color: "#FFFFFF",
            },
          },
        },
      },
    },
    // Calendar Layout container styles
    MuiPickersLayout: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          border: "1px solid #F1F5F9",
          overflow: "hidden",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.04), 0 8px 10px -6px rgba(15, 23, 42, 0.04)",
          "& .MuiPickersLayout-actions": {
            display: "none", // Hide default action buttons
          },
        },
      },
    },
    // Header component customization
    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: {
          paddingLeft: "20px",
          paddingRight: "12px",
          marginTop: "16px",
          marginBottom: "12px",
        },
        label: {
          fontWeight: 700,
          fontSize: "0.95rem",
          color: "#0F172A",
        },
      },
    },
    // Customizing the days week names header row
    MuiDayCalendar: {
      styleOverrides: {
        headerRow: {
          marginBottom: "4px",
        },
        weekDayLabel: {
          fontWeight: 700,
          fontSize: "0.75rem",
          color: "#94A3B8",
        },
      },
    },
  },
} as any)

export interface CustomCalendarProps {
  value: Dayjs | null
  onChange: (date: Dayjs | null) => void
  label?: string
  placeholder?: string
  staticInline?: boolean
  minDate?: Dayjs
  maxDate?: Dayjs
  className?: string
}

export function CustomCalendar({
  value,
  onChange,
  label,
  placeholder = "Select Date",
  staticInline = false,
  minDate,
  maxDate,
  className,
}: CustomCalendarProps) {
  const [mounted, setMounted] = React.useState(false)

  // Guard against Next.js SSR hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-[44px] bg-slate-50 border border-slate-100 rounded-2xl animate-pulse" />
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={calendarTheme}>
        <div className={className}>
          {label && (
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
              {label}
            </label>
          )}

          {staticInline ? (
            <div className="w-full max-w-[328px] mx-auto">
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                value={value}
                onChange={onChange}
                minDate={minDate}
                maxDate={maxDate}
                slotProps={{
                  actionBar: { actions: [] }, // Disable buttons
                }}
              />
            </div>
          ) : (
            <DatePicker
              value={value}
              onChange={onChange}
              minDate={minDate}
              maxDate={maxDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                  inputProps: {
                    placeholder: placeholder,
                  },
                  sx: {
                    "& .MuiOutlinedInput-root": {
                      height: "44px",
                      borderRadius: "16px",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#0F172A",
                      transition: "all 0.2s ease-out",
                      boxShadow: "0 1px 2px rgba(15, 23, 42, 0.02)",
                      "& fieldset": {
                        border: "none",
                      },
                      "&:hover": {
                        borderColor: "#CBD5E1",
                        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
                      },
                      "&.Mui-focused": {
                        borderColor: "#4F46E5",
                        boxShadow: "0 0 0 4px rgba(255, 70, 76, 0.08)",
                      },
                      "& input": {
                        padding: "0 16px",
                      },
                      "& .MuiIconButton-root": {
                        color: "#64748B",
                        marginRight: "4px",
                        "&:hover": {
                          backgroundColor: "#EEF2FF",
                          color: "#4F46E5",
                        },
                      },
                    },
                  },
                } as any,
              }}
            />
          )}
        </div>
      </ThemeProvider>
    </LocalizationProvider>
  )
}
