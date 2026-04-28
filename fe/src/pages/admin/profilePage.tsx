import { logout } from "@/apis/auth.api";
import { Button } from "@/components/shadcn/button";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ProfilePage = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error: any) {
      toast.warning(t(error));
    }
  };

  return <Button onClick={handleLogout}>{t("admin.logout")}</Button>;
};

export default ProfilePage;
