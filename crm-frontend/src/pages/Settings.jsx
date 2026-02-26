import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/Card1";
import Button from "../components/ui/Button1";
import Switch from "../components/ui/Switch1";
import Input from "../components/ui/Input1";
import { Label } from "../components/ui/Label1";
import { useTheme } from "../context/ThemeContext";
import { Loader2 } from "lucide-react";

export default function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔥 Load Profile From Backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://127.0.0.1:8000/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setProfile({
          name: data.name || "",
          email: data.email || "",
          password: "",
        });
      } catch (error) {
        console.error("Failed to load profile", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // 🔥 Save Profile To Backend
  const handleSave = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://127.0.0.1:8000/auth/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: profile.name,
            password: profile.password,
          }),
        }
      );

      const data = await res.json();

      alert(data.message || "Profile updated successfully");

      setProfile({ ...profile, password: "" });
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      {/* Profile Settings */}
      <Card className="shadow-md">
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Profile</h2>

          <div className="grid gap-4 max-w-md">
            <div>
              <Label>Name</Label>
              <Input
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={profile.email}
                disabled   // 🔒 Email not editable
              />
            </div>

            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                name="password"
                value={profile.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            <Button onClick={handleSave} disabled={saving}>
              {saving && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="shadow-md">
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Preferences</h2>

          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
          </div>

          <div className="flex items-center justify-between">
            <span>Email Notifications</span>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <span>In-App Notifications</span>
            <Switch
              checked={inAppNotifications}
              onCheckedChange={setInAppNotifications}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}