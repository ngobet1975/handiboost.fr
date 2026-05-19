'use client'

import React, { useState, useEffect, useRef } from 'react'

interface AddressAutocompleteProps {
  defaultValue?: string;
  onChange: (adresse: string, lat?: number, lng?: number) => void;
}

export default function AddressAutocomplete({ defaultValue = '', onChange }: AddressAutocompleteProps) {
  const [query, setQuery] = useState(defaultValue)
  const [results, setResults] = useState<any[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    setQuery(defaultValue || '')
  }, [defaultValue])

  const searchAddress = async (q: string) => {
    setQuery(q)
    onChange(q) // update parent with just string for now
    
    if (q.length < 3) {
      setResults([])
      return
    }
    
    try {
      const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=5`)
      const data = await res.json()
      if (data.features) {
        setResults(data.features)
        setShowDropdown(true)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleSelect = (feature: any) => {
    const label = feature.properties.label
    const coords = feature.geometry.coordinates // [lng, lat]
    setQuery(label)
    setShowDropdown(false)
    onChange(label, coords[1], coords[0])
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => searchAddress(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        placeholder="Tapez une adresse en France..."
        required
      />
      {showDropdown && results.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-slate-200 mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((r, i) => (
            <li 
              key={i} 
              onClick={() => handleSelect(r)}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-slate-700 border-b last:border-0 border-slate-100"
            >
              {r.properties.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
