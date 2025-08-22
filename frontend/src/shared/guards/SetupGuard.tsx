import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../shared/config/api";
import "./SetupGuard.css"; // create some basic modal styles

interface ProfileGuardProps {
  children: React.ReactNode;
}

export const ProfileGuard: React.FC<ProfileGuardProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false); // new info modal
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const profile = await getProfile();

        const isEmpty =
          !profile ||
          (!profile.bio &&
            (!profile.skills || profile.skills.length === 0) &&
            (!profile.experience || profile.experience.length === 0));

        if (profile.userId.usertype === "professional" && isEmpty) {
          setShowModal(true);

          setTimeout(() => {
            setShowModal(false);
            navigate("/profileEdit"); // redirect
            setInfoModal(true); // show info modal after redirect
          }, 3000);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          navigate("/profileEdit");
          setInfoModal(true);
        }, 2000);
      }
    };

    checkProfile();
  }, [navigate]);

  if (loading && !showModal) return <p>Loading...</p>;

  return (
    <>
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <p>Please complete your profile to continue.</p>
          </div>
        </div>
      )}

      {infoModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <p>Please fill at least one of: Bio, Skills, or Experience.</p>
            <button onClick={() => setInfoModal(false)}>Close</button>
          </div>
        </div>
      )}

      {!showModal && children}
    </>
  );
};
