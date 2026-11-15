import { useEffect, useMemo, useState } from "react";
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Activity,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Command,
  FileText,
  Image,
  Languages,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Menu,
  MessageSquareText,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Settings,
  Share2,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  Users,
  WandSparkles,
  X,
} from "lucide-react";

import { initialPosts, navGroups } from "./data";

const icons = {
  Overview: LayoutDashboard,
  "AI Assistant": Sparkles,
  "Content planner": CalendarDays,
  Posts: FileText,
  Analytics: TrendingUp,
  Campaigns: Target,
};

function readStored(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [posts, setPosts] = useState(initialPosts);
  const [toast, setToast] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  const [profile, setProfile] = useState(() =>
    readStored("cf-profile", {
      name: "Sam Carter",
      email: "sam@studio.com",
      role: "Content Manager",
    })
  );

  const [preferences, setPreferences] = useState(() =>
    readStored("cf-preferences", {
      darkMode: false,
      rtl: false,
      emailNotifications: true,
      postReminders: true,
      weeklyReport: false,
      workspace: "Studio Workspace",
      timezone: "Asia/Kolkata",
    })
  );

  const [signedOut, setSignedOut] = useState(false);

  useEffect(() => {
    localStorage.setItem("cf-profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(
      "cf-preferences",
      JSON.stringify(preferences)
    );
  }, [preferences]);

  const updatePreferences = (patch) => {
    setPreferences((current) => ({
      ...current,
      ...patch,
    }));
  };

  const notify = (message) => {
    setToast(message);

    window.clearTimeout(window.__cfToast);

    window.__cfToast = window.setTimeout(() => {
      setToast("");
    }, 2600);
  };

  const signOut = () => {
    setSignedOut(true);
    setShowProfile(false);
    setMobileOpen(false);
  };

  const handleLogin = () => {
    setSignedOut(false);
    setShowProfile(false);
    setMobileOpen(false);
    navigate("/");
  };

  const addPost = (post) => {
    setPosts((current) => [
      {
        ...post,
        id: Date.now(),
      },
      ...current,
    ]);

    notify("Your post has been saved to drafts.");
  };

  const pageTitle = useMemo(() => {
    const match = navGroups
      .flatMap((group) => group.items)
      .find(([, path]) => location.pathname === `/${path}`);

    return match?.[0] || "Overview";
  }, [location.pathname]);

  const profileInitials = profile.name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {signedOut ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <div
          className={`app-shell ${
            preferences.darkMode ? "theme-dark" : ""
          }`}
          dir={preferences.rtl ? "rtl" : "ltr"}
        >
          {/* SIDEBAR */}
          <aside
            className={`sidebar ${
              mobileOpen ? "sidebar-open" : ""
            }`}
          >
            <div className="brand">
              <div className="brand-mark">
                <Sparkles size={20} />
              </div>

              <div>
                <strong>
                  contentflow<span>AI</span>
                </strong>
                <small>CREATOR STUDIO</small>
              </div>

              <button
                className="mobile-close icon-button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="side-nav">
              {navGroups.map((group) => (
                <div className="nav-group" key={group.label}>
                  <p className="nav-label">{group.label}</p>

                  {group.items.map(([label, path]) => {
                    const Icon = icons[label];

                    return (
                      <NavLink
                        key={path}
                        to={`/${path}`}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          `nav-link ${isActive ? "active" : ""}`
                        }
                      >
                        {Icon && <Icon size={18} />}

                        <span>{label}</span>

                        {label === "AI Assistant" && (
                          <span className="new-pill">NEW</span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              ))}
            </nav>

            <div className="sidebar-bottom">
              <NavLink
                to="/settings"
                className="nav-link"
                onClick={() => setMobileOpen(false)}
              >
                <Settings size={18} />
                <span>Settings</span>
              </NavLink>

              <button
                className="nav-link signout"
                onClick={signOut}
              >
                <LogOut size={18} />
                <span>Sign out</span>
              </button>
            </div>
          </aside>

          {mobileOpen && (
            <button
              className="scrim"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            />
          )}

          {/* MAIN CONTENT */}
          <main className="main-area">
            {/* TOP NAVIGATION */}
            <header className="topbar">
              <div className="top-left">
                <button
                  className="icon-button mobile-menu"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu size={20} />
                </button>

                <div className="breadcrumbs">
                  Workspace
                  <ChevronRight size={14} />
                  <b>{pageTitle}</b>
                </div>
              </div>

              <div className="top-actions">
                {/* DARK MODE / LIGHT MODE */}
                <button
                  type="button"
                  className="icon-button appearance-toggle"
                  onClick={() =>
                    updatePreferences({
                      darkMode: !preferences.darkMode,
                    })
                  }
                  title={
                    preferences.darkMode
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                  aria-label="Toggle dark mode"
                >
                  {preferences.darkMode ? (
                    <Sun size={19} />
                  ) : (
                    <Moon size={19} />
                  )}
                </button>

                {/* RTL / LTR */}
                <button
                  type="button"
                  className={`icon-button appearance-toggle direction-toggle ${
                    preferences.rtl ? "appearance-active" : ""
                  }`}
                  onClick={() =>
                    updatePreferences({
                      rtl: !preferences.rtl,
                    })
                  }
                  title={
                    preferences.rtl
                      ? "Switch to LTR layout"
                      : "Switch to RTL layout"
                  }
                  aria-label="Toggle RTL and LTR layout"
                >
                  <Languages size={18} />
                  <span className="direction-label">
                    {preferences.rtl ? "RTL" : "LTR"}
                  </span>
                </button>

                {/* NOTIFICATIONS */}
                <button
                  className="icon-button notification"
                  onClick={() =>
                    notify("You're all caught up! No new notifications.")
                  }
                  aria-label="Notifications"
                  title="Notifications"
                >
                  <Bell size={18} />
                  <i />
                </button>

                {/* PROFILE MENU */}
                <div className="profile-wrap">
                  <button
                    className="profile-button"
                    onClick={() =>
                      setShowProfile((value) => !value)
                    }
                  >
                    <div className="avatar">
                      {profileInitials}
                    </div>

                    <span>
                      <b>{profile.name}</b>
                      <small>{profile.role}</small>
                    </span>

                    <ChevronDown size={14} />
                  </button>

                  {showProfile && (
                    <div className="profile-menu">
                      <b>{profile.name}</b>
                      <small>{profile.email}</small>

                      <NavLink
                        to="/settings"
                        onClick={() => setShowProfile(false)}
                      >
                        Account settings
                      </NavLink>

                      <button onClick={signOut}>
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* PAGE ROUTES */}
            <div className="page-wrap">
              <Routes>
                <Route
                  path="/"
                  element={
                    <Dashboard
                      posts={posts}
                      notify={notify}
                      profile={profile}
                      navigate={navigate}
                    />
                  }
                />

                <Route
                  path="/overview"
                  element={
                    <Dashboard
                      posts={posts}
                      notify={notify}
                      profile={profile}
                      navigate={navigate}
                    />
                  }
                />

                <Route
                  path="/assistant"
                  element={
                    <Assistant
                      addPost={addPost}
                      notify={notify}
                    />
                  }
                />

                <Route
                  path="/calendar"
                  element={
                    <Calendar
                      posts={posts}
                      addPost={addPost}
                      notify={notify}
                    />
                  }
                />

                <Route
                  path="/posts"
                  element={
                    <Posts
                      posts={posts}
                      notify={notify}
                    />
                  }
                />

                <Route
                  path="/analytics"
                  element={<Analytics />}
                />

                <Route
                  path="/campaigns"
                  element={
                    <Campaigns notify={notify} />
                  }
                />

                <Route
                  path="/settings"
                  element={
                    <SettingsPage
                      notify={notify}
                      profile={profile}
                      setProfile={setProfile}
                      preferences={preferences}
                      updatePreferences={updatePreferences}
                    />
                  }
                />

                <Route
                  path="*"
                  element={
                    <Dashboard
                      posts={posts}
                      notify={notify}
                      profile={profile}
                      navigate={navigate}
                    />
                  }
                />
              </Routes>
            </div>

            <footer className="footer">
              <span>© 2026 ContentFlow AI</span>

              <span>
                Made for your next big idea
                <Sparkles size={13} />
              </span>
            </footer>
          </main>

          {toast && (
            <div className="toast">
              <Check size={17} />
              {toast}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function PageHeading({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      {action}
    </div>
  );
}

function Button({
  children,
  variant = "primary",
  onClick,
  icon: Icon,
  ...props
}) {
  return (
    <button
      className={`button ${variant}`}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

/* DASHBOARD */

function Dashboard({
  posts,
  notify,
  profile,
  navigate,
}) {
  const published = posts.filter(
    (post) => post.status === "Published"
  ).length;

  const firstName = profile.name.split(" ")[0] || "there";

  return (
    <>
      <PageHeading
        eyebrow="YOUR CONTENT AT A GLANCE"
        title={`Good morning, ${firstName} `}
        description="Here's what's happening with your content today."
        action={
          <Button
            icon={WandSparkles}
            onClick={() => navigate("/assistant")}
          >
            Create with AI
          </Button>
        }
      />

      <div className="welcome-banner">
        <div className="welcome-orb orb-one" />
        <div className="welcome-orb orb-two" />

        <div className="banner-copy">
          <span className="banner-tag">
            <Sparkles size={13} />
            YOUR CREATIVE SPACE
          </span>

          <h2>
            Big ideas deserve
            <br />
            <em>great content.</em>
          </h2>

          <p>
            Plan smarter, create faster, and grow your audience —
            all in one place.
          </p>

          <Button
            variant="white"
            icon={Plus}
            onClick={() => navigate("/assistant")}
          >
            Start creating
          </Button>
        </div>

        <div className="banner-art">
          <div className="art-card card-back">
            <Image size={22} />
            <span>Visual story</span>
            <b>01 / 05</b>
          </div>

          <div className="art-card card-front">
            <div className="art-spark">
              <Sparkles size={23} />
            </div>

            <span>CREATIVE MODE</span>
            <strong>
              Make it
              <br />
              memorable.
            </strong>

            <div className="art-lines">
              <i />
              <i />
              <i />
            </div>
          </div>

          <div className="floating-chip">
            <TrendingUp size={15} />
            Growing 24%
          </div>
        </div>
      </div>

      <div className="section-head">
        <div>
          <h2>Performance overview</h2>
          <p>Your social channels at a glance</p>
        </div>

       
      </div>

      <div className="stats-grid">
        <Stat
          icon={Users}
          label="Total audience"
          value="24,892"
          change="+12.8%"
          tone="violet"
          note="vs. last month"
        />

        <Stat
          icon={Activity}
          label="Engagement rate"
          value="8.64%"
          change="+2.4%"
          tone="peach"
          note="vs. last month"
        />

        <Stat
          icon={Send}
          label="Posts published"
          value={String(published + 42)}
          change="+8.2%"
          tone="blue"
          note="vs. last month"
        />

        <Stat
          icon={EyeIcon}
          label="Total impressions"
          value="186.4K"
          change="+18.6%"
          tone="green"
          note="vs. last month"
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel performance-panel">
          <div className="panel-head">
            <div>
              <h3>Audience growth</h3>
              <p>Track how your community is growing</p>
            </div>

            <span className="legend">
              <i />
              Audience
            </span>
          </div>

          <div className="chart-summary">
            <strong>24,892</strong>
            <span className="positive">
              <ArrowUpRight size={14} />
              12.8%
            </span>
            <small>vs. previous 30 days</small>
          </div>

          <GrowthChart />
        </section>

        <section className="panel channel-panel">
          <div className="panel-head">
            <div>
              <h3>Channel performance</h3>
              <p>Engagement by platform</p>
            </div>

            <button
              className="dots"
              onClick={() => notify("Channel report options")}
            >
              <MoreHorizontal size={19} />
            </button>
          </div>

          <div className="channel-list">
            <Channel
              name="Instagram"
              initials="ig"
              color="instagram"
              value="68%"
              width="68%"
              detail="12.4K followers"
            />

            <Channel
              name="TikTok"
              initials="♪"
              color="tiktok"
              value="52%"
              width="52%"
              detail="8.2K followers"
            />

            <Channel
              name="LinkedIn"
              initials="in"
              color="linkedin"
              value="34%"
              width="34%"
              detail="3.1K followers"
            />

            <Channel
              name="Facebook"
              initials="f"
              color="facebook"
              value="21%"
              width="21%"
              detail="1.2K followers"
            />
          </div>
        </section>
      </div>

      <div className="dashboard-grid bottom-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Recent content</h3>
              <p>Your latest posts and drafts</p>
            </div>

            <NavLink to="/posts" className="text-link">
              View all
              <ArrowUpRight size={14} />
            </NavLink>
          </div>

          <div className="recent-list">
            {posts.slice(0, 4).map((post) => (
              <div className="recent-item" key={post.id}>
                <div className={`post-thumb ${post.color}`}>
                  <FileText size={19} />
                </div>

                <div className="recent-info">
                  <b>{post.title}</b>
                  <small>
                    {post.channel} · {post.date}
                  </small>
                </div>

                <Status status={post.status} />
              </div>
            ))}
          </div>
        </section>

        <section className="panel quick-panel">
          <div className="panel-head">
            <div>
              <h3>Quick actions</h3>
              <p>What would you like to do?</p>
            </div>
          </div>

          <div className="quick-actions">
            <button onClick={() => navigate("/assistant")}>
              <span className="quick-icon violet">
                <Sparkles />
              </span>
              <span>
                <b>Generate content</b>
                <small>Create captions with AI</small>
              </span>
              <ChevronRight />
            </button>

            <button onClick={() => navigate("/calendar")}>
              <span className="quick-icon peach">
                <CalendarDays />
              </span>
              <span>
                <b>Plan your week</b>
                <small>Organize upcoming posts</small>
              </span>
              <ChevronRight />
            </button>

            <button onClick={() => navigate("/posts")}>
              <span className="quick-icon blue">
                <Share2 />
              </span>
              <span>
                <b>Manage posts</b>
                <small>Review your content</small>
              </span>
              <ChevronRight />
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

function EyeIcon(props) {
  return <Activity {...props} />;
}

function Stat({
  icon: Icon,
  label,
  value,
  change,
  tone,
  note,
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={19} />
      </div>

      <span className="stat-label">{label}</span>
      <strong>{value}</strong>

      <div className="stat-foot">
        <span className="positive">
          <ArrowUpRight size={13} />
          {change}
        </span>
        <small>{note}</small>
      </div>
    </div>
  );
}

function GrowthChart() {
  return (
    <div className="growth-chart">
      <div className="chart-y">
        <span>30k</span>
        <span>20k</span>
        <span>10k</span>
        <span>0</span>
      </div>

      <div className="chart-area">
        <div className="chart-grid">
          <i />
          <i />
          <i />
          <i />
        </div>

        <svg
          viewBox="0 0 640 190"
          preserveAspectRatio="none"
          role="img"
          aria-label="Audience growth line chart"
        >
          <defs>
            <linearGradient
              id="fill"
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop
                offset="0"
                stopColor="#5f9255"
                stopOpacity=".25"
              />
              <stop
                offset="1"
                stopColor="#5f9255"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          <path
            d="M0 150 C35 142 48 128 80 135 S130 115 160 123 S210 98 240 110 S280 88 320 96 S370 70 400 82 S450 54 480 66 S530 40 560 49 S610 24 640 20 L640 190 L0 190Z"
            fill="url(#fill)"
          />

          <path
            d="M0 150 C35 142 48 128 80 135 S130 115 160 123 S210 98 240 110 S280 88 320 96 S370 70 400 82 S450 54 480 66 S530 40 560 49 S610 24 640 20"
            fill="none"
            stroke="#5f9255"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        <div className="chart-x">
          <span>Oct 12</span>
          <span>Oct 17</span>
          <span>Oct 22</span>
          <span>Oct 27</span>
          <span>Nov 1</span>
          <span>Nov 6</span>
          <span>Nov 10</span>
        </div>
      </div>
    </div>
  );
}

function Channel({
  name,
  initials,
  color,
  value,
  width,
  detail,
}) {
  return (
    <div className="channel-row">
      <div className={`social-icon ${color}`}>
        {initials}
      </div>

      <div className="channel-content">
        <div className="channel-meta">
          <b>{name}</b>
          <strong>{value}</strong>
        </div>

        <div className="progress">
          <i style={{ width }} />
        </div>

        <small>{detail}</small>
      </div>
    </div>
  );
}

function Status({ status }) {
  return (
    <span className={`status ${status.toLowerCase()}`}>
      {status}
    </span>
  );
}

/* AI ASSISTANT */

function Assistant({ addPost, notify }) {
  const [platform, setPlatform] = useState("Instagram");
  const [format, setFormat] = useState("Caption");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Friendly");
  const [result, setResult] = useState("");
  const [hashtags, setHashtags] = useState(true);

  const generate = () => {
    if (!topic.trim()) {
      notify("Please enter a topic first.");
      return;
    }

    setResult(
      `✨ ${topic.trim()} — small steps can lead to big things.

Share your perspective, inspire your community, and make space for ideas that matter. What's one thing you'd add?

${
  hashtags
    ? "#ContentCreation #CreativeCommunity #SocialMedia #YourBrand"
    : ""
}`
    );
  };

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(result);
      notify("Caption copied.");
    } catch {
      notify("Could not copy. Please select and copy the text.");
    }
  };

  return (
    <>
      <PageHeading
        eyebrow="YOUR AI CREATIVE PARTNER"
        title="Create something amazing"
        description="Turn a simple idea into content your audience will love."
      />

      <div className="composer-layout">
        <section className="panel composer-panel">
          <div className="panel-title-icon">
            <div className="quick-icon violet">
              <WandSparkles />
            </div>

            <div>
              <h3>AI content studio</h3>
              <p>Tell us what you want to create.</p>
            </div>
          </div>

          <label className="field-label">
            What are we creating for?
          </label>

          <div className="platform-options">
            {["Instagram", "TikTok", "LinkedIn", "Facebook"].map(
              (item) => (
                <button
                  key={item}
                  className={platform === item ? "chosen" : ""}
                  onClick={() => setPlatform(item)}
                >
                  <span
                    className={`social-icon ${item.toLowerCase()}`}
                  >
                    {item === "TikTok"
                      ? "♪"
                      : item === "LinkedIn"
                      ? "in"
                      : item === "Facebook"
                      ? "f"
                      : "ig"}
                  </span>
                  {item}
                </button>
              )
            )}
          </div>

          <label className="field-label">
            Content format
          </label>

          <div className="format-options">
            {[
              "Caption",
              "Post idea",
              "Short blog",
              "Product launch",
            ].map((item) => (
              <button
                key={item}
                className={format === item ? "chosen" : ""}
                onClick={() => setFormat(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <label className="field-label" htmlFor="topic">
            Describe your idea
          </label>

          <textarea
            id="topic"
            className="textarea"
            rows="4"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="e.g. Launching our new sustainable skincare range..."
          />

          <div className="field-row">
            <div>
              <label className="field-label">
                Writing tone
              </label>

              <select
                className="select-input"
                value={tone}
                onChange={(event) => setTone(event.target.value)}
              >
                <option>Friendly</option>
                <option>Professional</option>
                <option>Bold</option>
                <option>Inspirational</option>
                <option>Playful</option>
              </select>
            </div>

            <div className="toggle-field">
              <label className="field-label">
                Include hashtags
              </label>

              <button
                className={`toggle ${hashtags ? "on" : ""}`}
                onClick={() => setHashtags((value) => !value)}
              >
                <i />
              </button>
            </div>
          </div>

          <Button icon={Sparkles} onClick={generate}>
            Generate content
          </Button>

          <p className="helper-note">
            <Lightbulb size={14} />
            Demo mode: generated locally. Connect an AI API for live generation.
          </p>
        </section>

        <section className="panel preview-panel">
          <div className="panel-head">
            <div>
              <h3>Content preview</h3>
              <p>
                {platform} · {format}
              </p>
            </div>

            <span className="preview-label">
              <span />
              PREVIEW
            </span>
          </div>

          {result ? (
            <>
              <div className="generated-result">
                {result}
              </div>

              <div className="preview-actions">
                <Button
                  variant="outline"
                  onClick={copyResult}
                >
                  Copy text
                </Button>

                <Button
                  onClick={() =>
                    addPost({
                      title: topic,
                      channel: platform,
                      type: format,
                      status: "Draft",
                      date: "Nov 10, 2026",
                      time: "—",
                      color: "purple",
                      engagement: "—",
                    })
                  }
                >
                  Save as draft
                </Button>
              </div>
            </>
          ) : (
            <div className="empty-preview">
              <div className="empty-spark">
                <Sparkles size={26} />
              </div>

              <h3>Your next great post starts here</h3>

              <p>
                Fill in your idea and hit generate. Your content
                will appear here, ready to refine and share.
              </p>

              <div className="suggestion-chips">
                <span>✨ Brand storytelling</span>
                <span>📣 Product launch</span>
                <span>💡 Helpful tips</span>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

/* CONTENT CALENDAR */

function Calendar({ posts, addPost, notify }) {
  const [month, setMonth] = useState(10);
  const [year, setYear] = useState(2026);
  const [selected, setSelected] = useState(10);

  const monthName = new Date(year, month, 1).toLocaleString(
    "en",
    { month: "long" }
  );

  const days = new Date(year, month + 1, 0).getDate();
  const start = new Date(year, month, 1).getDay();

  const cells = [
    ...Array(start).fill(null),
    ...Array(days)
      .fill(0)
      .map((_, index) => index + 1),
  ];

  const next = () => {
    if (month === 11) {
      setMonth(0);
      setYear((value) => value + 1);
    } else {
      setMonth((value) => value + 1);
    }
  };

  const prev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((value) => value - 1);
    } else {
      setMonth((value) => value - 1);
    }
  };

  const selectedPosts = posts.filter(
    (post) =>
      Number(post.date.match(/\d+/)?.[0]) === selected &&
      post.date.includes(monthName.slice(0, 3))
  );

  const createPost = () =>
    addPost({
      title: "New content idea",
      channel: "Instagram",
      type: "Post",
      status: "Draft",
      date: `${monthName.slice(0, 3)} ${selected}, ${year}`,
      time: "10:00 AM",
      color: "purple",
      engagement: "—",
    });

  return (
    <>
      <PageHeading
        eyebrow="PLAN AHEAD"
        title="Content calendar"
        description="See your publishing schedule and keep every channel in sync."
        action={
          <Button icon={Plus} onClick={createPost}>
            Add post
          </Button>
        }
      />

      <div className="calendar-layout">
        <section className="panel calendar-panel">
          <div className="calendar-toolbar">
            <div>
              <h3>
                {monthName} {year}
              </h3>
              <p>Plan, organize and publish your content</p>
            </div>

            <div className="calendar-nav">
              <button className="icon-button" onClick={prev}>
                <ChevronLeft />
              </button>

              <button
                className="today-button"
                onClick={() => {
                  setMonth(10);
                  setYear(2026);
                  setSelected(10);
                }}
              >
                Today
              </button>

              <button className="icon-button" onClick={next}>
                <ChevronRight />
              </button>
            </div>
          </div>

          <div className="calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day) => (
                <div className="weekday" key={day}>
                  {day}
                </div>
              )
            )}

            {cells.map((day, index) => (
              <button
                key={index}
                className={`calendar-day ${
                  day === selected ? "selected" : ""
                } ${
                  day === 10 && month === 10 && year === 2026
                    ? "today"
                    : ""
                }`}
                disabled={!day}
                onClick={() => setSelected(day)}
              >
                <span>{day || ""}</span>

                {day &&
                  posts
                    .filter(
                      (post) =>
                        Number(post.date.match(/\d+/)?.[0]) === day &&
                        post.date.includes(monthName.slice(0, 3))
                    )
                    .slice(0, 2)
                    .map((post) => (
                      <i
                        className={`event-dot ${post.color}`}
                        key={post.id}
                      >
                        {post.title}
                      </i>
                    ))}
              </button>
            ))}
          </div>

          <div className="calendar-legend">
            <span>
              <i className="dot violet-dot" />
              Instagram
            </span>
            <span>
              <i className="dot blue-dot" />
              LinkedIn
            </span>
            <span>
              <i className="dot peach-dot" />
              Other channels
            </span>
          </div>
        </section>

        <section className="panel agenda-panel">
          <div className="panel-head">
            <div>
              <h3>
                {monthName} {selected}
              </h3>
              <p>Daily agenda</p>
            </div>

            <span className="agenda-count">
              {selectedPosts.length} posts
            </span>
          </div>

          {selectedPosts.length ? (
            selectedPosts.map((post) => (
              <div className="agenda-item" key={post.id}>
                <span className="agenda-time">
                  <Clock3 size={13} />
                  {post.time}
                </span>

                <b>{post.title}</b>
                <small>
                  {post.channel} · {post.status}
                </small>
              </div>
            ))
          ) : (
            <div className="agenda-empty">
              <CalendarDays size={26} />
              <b>Nothing planned yet</b>
              <p>Your day is open. Add a post to get started.</p>

              <Button
                variant="outline"
                icon={Plus}
                onClick={createPost}
              >
                Add a post
              </Button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

/* POSTS */

function Posts({ posts, notify }) {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState(() => {
    return new URLSearchParams(window.location.search).get("search") || "";
  });

  const filtered = posts.filter(
    (post) =>
      (filter === "All" || post.status === filter) &&
      post.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <PageHeading
        eyebrow="CONTENT LIBRARY"
        title="Your posts"
        description="Manage drafts, scheduled content and published posts."
        action={
          <Button
            icon={Plus}
            onClick={() => {
              window.location.href = "/assistant";
            }}
          >
            Create post
          </Button>
        }
      />

      <section className="panel posts-panel">
        <div className="posts-toolbar">
          <label className="table-search">
            <Search size={16} />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search posts..."
            />
          </label>

          <div className="filter-tabs">
            {["All", "Published", "Scheduled", "Draft"].map(
              (status) => (
                <button
                  key={status}
                  className={filter === status ? "active" : ""}
                  onClick={() => setFilter(status)}
                >
                  {status}
                </button>
              )
            )}
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>CONTENT</th>
                <th>CHANNEL</th>
                <th>TYPE</th>
                <th>DATE</th>
                <th>STATUS</th>
                <th>ENGAGEMENT</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {filtered.map((post) => (
                <tr key={post.id}>
                  <td>
                    <div className="table-content">
                      <div className={`post-thumb ${post.color}`}>
                        <FileText size={17} />
                      </div>
                      <b>{post.title}</b>
                    </div>
                  </td>

                  <td>{post.channel}</td>
                  <td>{post.type}</td>

                  <td>
                    {post.date}
                    <small className="cell-sub">
                      {post.time}
                    </small>
                  </td>

                  <td>
                    <Status status={post.status} />
                  </td>

                  <td>{post.engagement}</td>

                  <td>
                    <button
                      className="dots"
                      onClick={() =>
                        notify("Post actions are in demo mode.")
                      }
                    >
                      <MoreHorizontal />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!filtered.length && (
            <div className="no-results">
              No posts found. Try another search or filter.
            </div>
          )}
        </div>
      </section>
    </>
  );
}

/* ANALYTICS */

function Analytics() {
  return (
    <>
      <PageHeading
        eyebrow="MEASURE WHAT MATTERS"
        title="Analytics"
        description="Understand what's working and where your audience is growing."
        action={
          <button className="select-button">
            <CalendarDays size={15} />
            Last 30 days
            <ChevronDown size={14} />
          </button>
        }
      />

      <div className="stats-grid">
        <Stat
          icon={EyeIcon}
          label="Impressions"
          value="186.4K"
          change="+18.6%"
          tone="violet"
          note="vs. last period"
        />

        <Stat
          icon={Users}
          label="Audience"
          value="24,892"
          change="+12.8%"
          tone="blue"
          note="vs. last period"
        />

        <Stat
          icon={Activity}
          label="Engagement"
          value="8.64%"
          change="+2.4%"
          tone="peach"
          note="vs. last period"
        />

        <Stat
          icon={MessageSquareText}
          label="Interactions"
          value="12,408"
          change="+9.1%"
          tone="green"
          note="vs. last period"
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel performance-panel">
          <div className="panel-head">
            <div>
              <h3>Performance over time</h3>
              <p>
                Impressions across your connected channels
              </p>
            </div>
          </div>

          <GrowthChart />
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Top content</h3>
              <p>Best performing this month</p>
            </div>
          </div>

          <div className="top-content-list">
            {[
              ["01", "How to tell your brand story", "12.8K views"],
              ["02", "A day in our creative studio", "9.4K views"],
              ["03", "5 tips for consistent content", "7.2K views"],
            ].map((item) => (
              <div className="top-content" key={item[0]}>
                <span>{item[0]}</span>
                <b>{item[1]}</b>
                <small>{item[2]}</small>
              </div>
            ))}
          </div>
        </section>
      </div>

      <p className="demo-disclaimer">
        Analytics shown are illustrative sample metrics. Connect
        your social accounts to display live performance.
      </p>
    </>
  );
}

/* CAMPAIGNS */

function Campaigns({ notify }) {
  const campaigns = [
    [
      "Holiday launch campaign",
      "Instagram · Facebook",
      "Nov 01 – Nov 30",
      "Active",
      72,
    ],
    [
      "Creator community series",
      "LinkedIn · Instagram",
      "Oct 15 – Nov 15",
      "Active",
      84,
    ],
    [
      "Summer collection teaser",
      "Instagram · TikTok",
      "Sep 01 – Sep 30",
      "Completed",
      100,
    ],
  ];

  return (
    <>
      <PageHeading
        eyebrow="MAKE AN IMPACT"
        title="Campaigns"
        description="Bring your content together around a bigger idea."
        action={
          <Button
            icon={Plus}
            onClick={() =>
              notify("Campaign creation form is coming soon.")
            }
          >
            New campaign
          </Button>
        }
      />

      <div className="campaign-grid">
        {campaigns.map(
          ([name, channels, date, status, progress], index) => (
            <section className="panel campaign-card" key={name}>
              <div className="campaign-top">
                <span className={`campaign-symbol c${index}`}>
                  <Target />
                </span>

                <Status
                  status={
                    status === "Completed"
                      ? "Published"
                      : "Scheduled"
                  }
                />
              </div>

              <h3>{name}</h3>
              <p>{channels}</p>

              <div className="campaign-date">
                <CalendarDays size={14} />
                {date}
              </div>

              <div className="campaign-progress">
                <div>
                  <span>Campaign progress</span>
                  <b>{progress}%</b>
                </div>

                <div className="progress">
                  <i style={{ width: `${progress}%` }} />
                </div>
              </div>

              <button
                className="campaign-link"
                onClick={() =>
                  notify(`${name}: demo campaign details.`)
                }
              >
                View campaign
                <ArrowUpRight size={15} />
              </button>
            </section>
          )
        )}
      </div>
    </>
  );
}

/* SETTINGS */

function SettingsPage({
  notify,
  profile,
  setProfile,
  preferences,
  updatePreferences,
}) {
  const [tab, setTab] = useState("Profile");
  const [draft, setDraft] = useState(profile);
  const [workspace, setWorkspace] = useState(
    preferences.workspace
  );

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  useEffect(() => {
    setWorkspace(preferences.workspace);
  }, [preferences.workspace]);

  const tabs = [
    ["Profile", Users],
    ["Workspace", Command],
    ["Notifications", Bell],
    ["Connected accounts", Share2],
    ["Appearance", Sparkles],
  ];

  const saveProfile = () => {
    if (!draft.name.trim() || !draft.email.trim()) {
      notify("Please enter your name and email address.");
      return;
    }

    setProfile(draft);
    notify("Your profile has been updated.");
  };

  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`toggle ${checked ? "on" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <i />
    </button>
  );

  return (
    <>
      <PageHeading
        eyebrow="MAKE IT YOURS"
        title="Settings"
        description="Manage your profile, workspace and preferences."
      />

      <div className="settings-layout">
        <aside className="panel settings-menu">
          {tabs.map(([label, Icon]) => (
            <button
              key={label}
              className={`settings-tab ${
                tab === label ? "active" : ""
              }`}
              onClick={() => setTab(label)}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </aside>

        <section className="panel settings-form">
          {tab === "Profile" && (
            <>
              <h3>Personal information</h3>
              <p>
                Changes saved here are reflected in your account menu.
              </p>

              <div className="settings-avatar">
                <div className="avatar big-avatar">
                  {initials}
                </div>

                <div>
                  <b>{profile.name}</b>
                  <small>{profile.email}</small>
                </div>
              </div>

              <label className="field-label">Full name</label>
              <input
                className="text-input"
                value={draft.name}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    name: event.target.value,
                  })
                }
              />

              <label className="field-label">Email address</label>
              <input
                className="text-input"
                type="email"
                value={draft.email}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    email: event.target.value,
                  })
                }
              />

              <label className="field-label">Role</label>
              <input
                className="text-input"
                value={draft.role}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    role: event.target.value,
                  })
                }
              />

              <div className="settings-save">
                <Button onClick={saveProfile}>
                  Save changes
                </Button>
              </div>
            </>
          )}

          {tab === "Workspace" && (
            <>
              <h3>Workspace settings</h3>
              <p>
                Choose the name and regional settings for this workspace.
              </p>

              <label className="field-label">
                Workspace name
              </label>

              <input
                className="text-input"
                value={workspace}
                onChange={(event) =>
                  setWorkspace(event.target.value)
                }
              />

              <label className="field-label">Time zone</label>

              <select
                className="select-input full-input"
                value={preferences.timezone}
                onChange={(event) =>
                  updatePreferences({
                    timezone: event.target.value,
                  })
                }
              >
                <option value="Asia/Kolkata">
                  India Standard Time (IST)
                </option>
                <option value="America/New_York">
                  Eastern Time
                </option>
                <option value="Europe/London">
                  London
                </option>
                <option value="UTC">UTC</option>
              </select>

              <div className="settings-save">
                <Button
                  onClick={() => {
                    updatePreferences({ workspace });
                    notify("Workspace settings saved.");
                  }}
                >
                  Save workspace
                </Button>
              </div>
            </>
          )}

          {tab === "Notifications" && (
            <>
              <h3>Notification preferences</h3>
              <p>
                Choose which reminders and updates you want to receive.
              </p>

              <div className="preference-row">
                <div>
                  <b>Email notifications</b>
                  <small>
                    Receive important workspace updates by email.
                  </small>
                </div>

                <Toggle
                  checked={preferences.emailNotifications}
                  onChange={(value) =>
                    updatePreferences({
                      emailNotifications: value,
                    })
                  }
                />
              </div>

              <div className="preference-row">
                <div>
                  <b>Post reminders</b>
                  <small>
                    Get a reminder before scheduled content is due.
                  </small>
                </div>

                <Toggle
                  checked={preferences.postReminders}
                  onChange={(value) =>
                    updatePreferences({
                      postReminders: value,
                    })
                  }
                />
              </div>

              <div className="preference-row">
                <div>
                  <b>Weekly performance report</b>
                  <small>
                    Show a weekly summary of your content performance.
                  </small>
                </div>

                <Toggle
                  checked={preferences.weeklyReport}
                  onChange={(value) =>
                    updatePreferences({
                      weeklyReport: value,
                    })
                  }
                />
              </div>

              <div className="settings-save">
                <Button
                  onClick={() =>
                    notify("Notification preferences saved.")
                  }
                >
                  Save preferences
                </Button>
              </div>
            </>
          )}

          {tab === "Connected accounts" && (
            <>
              <h3>Connected social accounts</h3>
              <p>
                Demo connection status. Real publishing requires
                platform API authorization.
              </p>

              {["Instagram", "Facebook", "LinkedIn", "TikTok"].map(
                (network, index) => (
                  <div
                    className="preference-row account-row"
                    key={network}
                  >
                    <div>
                      <b>{network}</b>
                      <small>
                        {index === 0
                          ? "Demo account · @contentflow.studio"
                          : "Not connected"}
                      </small>
                    </div>

                    <button
                      className="button outline small"
                      onClick={() =>
                        notify(
                          index === 0
                            ? "Instagram demo account is connected."
                            : `${network} connection requires API credentials and authorization.`
                        )
                      }
                    >
                      {index === 0 ? "Connected" : "Connect"}
                    </button>
                  </div>
                )
              )}
            </>
          )}

          {tab === "Appearance" && (
            <>
              <h3>Appearance & language direction</h3>
              <p>
                Customize how ContentFlow AI looks and how text is displayed.
              </p>

              <div className="preference-row">
                <div>
                  <b>Dark mode</b>
                  <small>
                    Use a darker interface across the dashboard.
                  </small>
                </div>

                <Toggle
                  checked={preferences.darkMode}
                  onChange={(value) =>
                    updatePreferences({
                      darkMode: value,
                    })
                  }
                />
              </div>

              <div className="preference-row">
                <div>
                  <b>Right-to-left layout (RTL)</b>
                  <small>
                    Mirror the layout for right-to-left languages.
                  </small>
                </div>

                <Toggle
                  checked={preferences.rtl}
                  onChange={(value) =>
                    updatePreferences({
                      rtl: value,
                    })
                  }
                />
              </div>

              <div className="settings-save">
                <Button
                  variant="outline"
                  onClick={() => {
                    updatePreferences({
                      darkMode: false,
                      rtl: false,
                    });

                    notify("Appearance reset to default.");
                  }}
                >
                  Reset appearance
                </Button>
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
}

/* LOGIN PAGE */

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    onLogin();
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-logo">
          <Sparkles size={30} />
          <h1>ContentFlow AI</h1>
        </div>

        <h2>Welcome back!</h2>
        <p>Sign in to continue to your workspace.</p>

        <label htmlFor="login-email">Email address</label>
        <input
          id="login-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error && <div className="login-error">{error}</div>}

        <button type="submit" className="login-button">
          Continue to ContentFlow AI
        </button>
      </form>
    </div>
  );
}

export default App;