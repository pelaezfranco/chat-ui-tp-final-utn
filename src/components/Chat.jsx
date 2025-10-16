import { useState, useEffect } from "react"
import { useChat } from "../context/ChatContext"
import { Link, useNavigate } from "react-router-dom"

export default function Chat() {
  const [msg, setMsg] = useState("")
  const [showPopup, setShowPopup] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode")
    return saved === "true"
  })

  const [chatBgColor, setChatBgColor] = useState(() => {
    const saved = localStorage.getItem("chatBgColor")
    return saved || "#fafafa"
  })

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
    localStorage.setItem("darkMode", darkMode)
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem("chatBgColor", chatBgColor)
    document.documentElement.style.setProperty("--chat-bg-color", chatBgColor)
  }, [chatBgColor])

  // 1. Obtenemos del contexto todo lo necesario
  const { users, selectedUser, setUsers } = useChat()

  // 2. Buscamos el usuario activo
  const user = users.find(u => u.id === selectedUser)

  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="user-not-found">
        <p>No hay usuario seleccionado...</p>
      </div>
    )
  }

  // 3. Manejo del input
  const handleChange = (event) => {
    setMsg(event.target.value)
  }

  // 4. Cuando enviamos el formulario
  const handleSubmit = (event) => {
    event.preventDefault()

    const newMessage = {
      id: crypto.randomUUID(),
      text: msg,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    // ✅ Actualizamos el estado de manera INMUTABLE
    const updatedUsers = users.map(u =>
      u.id === user.id
        ? { ...u, messages: [...u.messages, newMessage] }
        : u
    )

    setUsers(updatedUsers) // esto dispara el useEffect del contexto que guarda en localStorage

    setMsg("")
  }

  const handleShowPopup = () => {
    setShowPopup(true)
  }

  const handleClosePopup = () => {
    setShowPopup(false)
  }

  const handleThemeChange = (event) => {
    setDarkMode(event.target.value === "dark")
  }

  const handleColorChange = (event) => {
    setChatBgColor(event.target.value)
  }

  return (
    <>
      {
        showPopup === true && <section className="cont-popup">
          <div className="popup">
            <h2>Configuración de Chat</h2>
            <div className="popup-options">
              <div className="popup-option">
                <h3>Cambiar tema:</h3>
                <select value={darkMode ? "dark" : "light"} onChange={handleThemeChange}>
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                </select>
              </div>
              <div className="popup-option">
                <h3>Color de fondo del chat:</h3>
                <select value={chatBgColor} onChange={handleColorChange}>
                  <option value="#fafafa">Blanco</option>
                  <option value="#e3f2fd">Azul pastel</option>
                  <option value="#fce4ec">Rosa pastel</option>
                  <option value="#e8f5e9">Verde pastel</option>
                  <option value="#fffde7">Amarillo pastel</option>
                  <option value="#f3e5f5">Lavanda pastel</option>
                  <option value="#fff3e0">Melocotón pastel</option>
                </select>
              </div>
            </div>
            <button onClick={handleClosePopup}>Cerrar</button>
          </div>
        </section>
      }
      <div className="chat">
        <header className="chat-header">
          <div>
            <div className="chat-user">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s"
                alt={user.name}
                className="chat-avatar"
              />
              <strong>{user.name}</strong>
              {user.lastSeen !== "" && <span className="last-seen">Last seen: {user.lastSeen}</span>}
            </div>
          </div>

          <div className="chat-actions">
            <button title="Camera">📷</button>
            <button title="Gallery">🖼️</button>
            <button title="Settings" onClick={handleShowPopup}>⚙️</button>
            <Link to="/help" title="Help">❓</Link>
          </div>
        </header>

        <section className="chat-messages">
          {user.messages.map((message) => (
            <div className="message" key={message.id}>
              <p>{message.text}</p>
              <span className="time">{message.time}</span>
            </div>
          ))}
        </section>

        <footer className="chat-footer">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter text here..."
              onChange={handleChange}
              value={msg}
            />
            <button>➤</button>
          </form>
        </footer>
      </div>
    </>
  )
}
