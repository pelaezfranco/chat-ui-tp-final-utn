import { createContext, useContext, useState, useEffect } from "react"

const ChatContext = createContext()

const ChatProvider = ({ children }) => {
  // 1. Estado de usuarios
  // Inicializamos vacío; luego lo cargamos de localStorage o mock
  const [users, setUsers] = useState([])

  // 2. Estado del usuario seleccionado
  const [selectedUser, setSelectedUser] = useState(null)

  // 3. Al montar el Provider, revisamos si hay usuarios guardados en localStorage
  //    - Si existen, los usamos
  //    - Si no existen, cargamos los mock iniciales
  useEffect(() => {
    const storedUsers = localStorage.getItem("users")

    if (storedUsers !== null) {
      setUsers(JSON.parse(storedUsers))
    } else {
      const initialUsers = [
        {
          id: 1,
          name: "Juan perez",
          status: "online",
          lastSeen: "",
          messages: [
            { id: 1, text: "Hola, como estas?", time: "00:40" }
          ]
        },
        {
          id: 2,
          name: "Marita Rodriguez",
          status: "offline",
          lastSeen: "3 hours ago",
          messages: [
            { id: 1, text: "RESPONDEEEE QUE TENGO HAMBREE!", time: "15:00" },
            { id: 2, text: "estoy desde las 12 en el banco!!", time: "15:10" },
            { id: 3, text: "ahora voy a casa, llevo empanadas :)", time: "20:00" }
          ]
        },
        {
          id: 3,
          name: "Luka Nicolas Piaggi",
          status: "online",
          lastSeen: "",
          messages: [
            { id: 1, text: "Me encanta programación!!", time: "19:00" },
            { id: 2, text: "El profe es un capo!!!!!", time: "19:01" }
          ]
        },
        {
          id: 4,
          name: "Lucas Hernan Figueroa",
          status: "offline",
          lastSeen: "1 minute ago",
          messages: [
            { id: 1, text: "Estoy en programación, después te mando...", time: "18:59" }
          ]
        }
      ]
      setUsers(initialUsers)
      // Actualizamos la lista de usuarios en el localstorage
      localStorage.setItem("users", JSON.stringify(initialUsers))
    }
  }, [])

  // 4. Cada vez que `users` cambie, sincronizamos con localStorage
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("users", JSON.stringify(users))
    }
  }, [users])

  return (
    <ChatContext.Provider value={{ users, setUsers, selectedUser, setSelectedUser }}>
      {children}
    </ChatContext.Provider>
  )
}

const useChat = () => useContext(ChatContext)

export { useChat, ChatProvider }
