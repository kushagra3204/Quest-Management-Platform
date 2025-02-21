import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import "../styles/home.css"

interface CompletedQuest {
  title: string
  description: string
  reward: string
  completedAt?: string
  rank?: number | string
}

interface UserData {
  username: string
  avatar: string[]
  coins: number
  level: number
  experience: number
  badge: string[]
  completedQuests: CompletedQuest[]
}

const Home = () => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [redirect, setRedirect] = useState(false)
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate()

  useEffect(() => {
    ; (async () => {
      const authResponse = await fetch("http://localhost:5000/api/auth/user", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })

      const data = await authResponse.json();
      setRole(data.role)

      if (!authResponse.ok) {
        setRedirect(true)
        setLoading(false)
        return
      }

      const userDetailsResponse = await fetch("http://localhost:5000/api/user/user-details", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })

      if (userDetailsResponse.ok) {
        const userDetails = await userDetailsResponse.json()
        setUserData(userDetails)
      } else {
        setUserData(null)
      }

      setLoading(false)
    })()
  }, [])

  const logout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })

    setUserData(null)
    setRedirect(true)
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!userData || redirect) return <Navigate to="/login" />

  return (
    <div className="home-container">
      <div className="profile-section">
        <div className="profile-header">
          <div className="avatar-wrapper">
            <img
              src={userData.avatar.length > 0 ? userData.avatar[0] : "default-avatar.png"}
              alt="User Avatar"
              className="avatar"
            />
            <div className="level-badge">{userData.level}</div>
          </div>
          <div className="user-info">
            <h2>Welcome, {userData.username}!</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Coins</span>
                <span className="stat-value">{userData.coins}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Experience</span>
                <span className="stat-value">{userData.experience}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Badges</span>
                <span className="stat-value">{userData.badge.join(", ")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="actions">
          <button className="action-button primary" onClick={() => navigate("/active-quests")}>
            Active Quests
          </button>
          {role === "admin" && <button className="action-button secondary" onClick={() => navigate("/create-quest")}>
            Create Quest
          </button>}
          <button className="action-button secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="quests-section">
        <h3>Completed Quests</h3>
        {userData.completedQuests.length > 0 ? (
          <div className="quests-grid">
            {userData.completedQuests.map((quest, index) => (
              <div key={index} className="quest-card">
                <div className="quest-content">
                  <h4>{quest.title}</h4>
                  <p className="quest-description">{quest.description}</p>
                  <div className="quest-details">
                    <div className="detail-item">
                      <span className="detail-label">Reward:</span>
                      <span className="detail-value">{quest.reward}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Rank:</span>
                      <span className="detail-value">
                        {quest.rank !== "Not ranked" ? `#${quest.rank}` : "Not ranked yet"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Completed:</span>
                      <span className="detail-value">
                        {quest.completedAt ? new Date(quest.completedAt).toLocaleString() : "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-quests">No completed quests yet.</p>
        )}
      </div>
    </div>
  )
}

export default Home
