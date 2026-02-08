import { useState, useEffect } from 'react'

export function useAuth() {
  const [user, setUser] = useState(null)
  // Auth hook implementation
  return { user }
}
