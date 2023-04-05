import { LogoutOutlined } from "@mui/icons-material";
import {  signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import {auth} from '../../utils/firebase';
import { err } from "../../utils/toast";

const LogoutButton = () => {
  const navigate = useNavigate()

  const handleLogout = () => {               
    signOut(auth).then(() => {
        navigate("/");
    })
    .catch(() => {
      err('Fehler!')
    })
  }

  return <LogoutOutlined className="pointer" onClick={handleLogout} />
};

export default LogoutButton;