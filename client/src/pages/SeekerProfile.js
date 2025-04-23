import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function SeekerProfile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({ name: '', email: '', profilePicture: '' });
  const [newPicture, setNewPicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setLoading(true);
      axios
        .get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((res) => {
          setProfile(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching profile:', err);
          setError('Failed to load profile.');
          setLoading(false);
        });
    }
  }, [user]);

  const handlePictureChange = (e) => {
    setNewPicture(e.target.files[0]);
  };

  const handlePictureUpload = async () => {
    if (!newPicture) return;
    const formData = new FormData();
    formData.append('profilePicture', newPicture);

    try {
      const res = await axios.put(
        'http://localhost:5000/api/users/profile/picture',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setProfile({ ...profile, profilePicture: res.data.profilePicture });
      alert('Profile picture updated successfully!');
    } catch (err) {
      console.error('Error uploading picture:', err);
      setError('Failed to upload picture.');
    }
  };

  const openFotorEditor = () => {
    // Redirect to Fotor's online editor
    window.open('https://www.fotor.com/photo-editor-app/editor', '_blank');
  };

  if (!user || user.role !== 'seeker') {
    return <div>Access Denied</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      {loading ? (
        <p>Loading profile...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Profile Picture</h3>
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt="Profile"
                className="w-32 h-32 rounded-full mt-2"
              />
            ) : (
              <p>No profile picture set.</p>
            )}
          </div>
          <div className="mb-4">
            <button
              onClick={openFotorEditor}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
            >
              Edit Photo with Fotor
            </button>
            <p className="text-gray-600 mt-2">
              After editing in Fotor, download the image and upload it below.
            </p>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Upload Edited Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <button
            onClick={handlePictureUpload}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Picture
          </button>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Details</h3>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SeekerProfile;