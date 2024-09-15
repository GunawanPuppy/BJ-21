import React, { useState } from "react";
import { MdAlternateEmail, MdEdit, MdSave } from "react-icons/md";
import { FiPhoneCall } from "react-icons/fi";
import { TfiLocationPin } from "react-icons/tfi";

export default function Profile() {
  // Dummy data for user profile
  const initialProfile = {
    fullName: "John Doe",
    phoneNumber: "+1234567890",
    location: "New York, USA",
    status: "Active",
    email: "john.doe@example.com",
    introduction: `John Doe adalah seorang penjudi profesional dengan pengalaman lebih dari 20 tahun di industri ini. Dengan keahlian yang mendalam dalam permainan kartu seperti poker dan blackjack, serta strategi taruhan olahraga, John telah mengukir namanya di berbagai kasino ternama di Las Vegas dan Atlantic City. Keterampilan analitisnya yang tajam dan kemampuannya untuk tetap tenang di bawah tekanan membuatnya menjadi lawan yang disegani di meja judi. Selain itu, John juga sering menjadi pembicara di seminar-seminar judi, membagikan pengetahuannya tentang teknik-teknik taruhan yang efektif dan manajemen risiko. Dalam karirnya, dia telah memenangkan sejumlah turnamen besar dan dikenal karena etos kerjanya yang tak kenal lelah serta dedikasinya untuk selalu mengasah kemampuan judinya. John adalah contoh sempurna dari seseorang yang telah mengubah hasrat menjadi profesi yang sukses.`,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaXFm4blQPR-e3p9qZFH76MmQQgyPf21yQRg&s"
  };

  const [userProfile, setUserProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState({
    fullName: false,
    phoneNumber: false,
    location: false,
    status: false,
    email: false,
    introduction: false,
    imageUrl: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile({
      ...userProfile,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUserProfile({
        ...userProfile,
        imageUrl: reader.result
      });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const toggleEditing = (field) => {
    setIsEditing({
      ...isEditing,
      [field]: !isEditing[field]
    });
  };

  const handleSave = (field) => {
    toggleEditing(field);
    console.log('Profile updated successfully:', userProfile);
  };

  const renderField = (field, icon, label) => {
    return isEditing[field] ? (
      <div className="flex items-center mt-4">
        <input
          type="text"
          name={field}
          value={userProfile[field]}
          onChange={handleChange}
          className="block w-full mt-2 border border-gray-300 rounded-md"
        />
        <MdSave className="ml-2 text-gray-600 cursor-pointer" onClick={() => handleSave(field)} />
      </div>
    ) : (
      <div className="flex items-center justify-center mt-4">
        {icon}
        <p className="ml-3 text-gray-800">{userProfile[field]}</p>
        <MdEdit className="ml-2 text-gray-600 cursor-pointer" onClick={() => toggleEditing(field)} />
      </div>
    );
  };

  return (
      <section className="flex flex-col w-[90%] sm:w-[85%] overflow-y-auto">
        <div className="flex-1 p-6 bg-gray-100">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">
            Profile 
          </h1>
          <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden md:max-w-2xl">
            <div className="md:flex">
              <div className="w-full p-4">
                <div className="relative">
                  <img
                    className="h-32 w-32 rounded-full mx-auto"
                    src={userProfile.imageUrl}
                    alt="Profile"
                  />
                  <MdEdit className="absolute top-0 right-0 m-2 text-gray-600 cursor-pointer" onClick={() => toggleEditing('imageUrl')} />
                  {isEditing.imageUrl && (
                    <div className="mt-2 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <MdSave className="ml-2 text-gray-600 cursor-pointer" onClick={() => handleSave('imageUrl')} />
                    </div>
                  )}
                </div>
                <div className="mt-4 text-center">
                  {renderField("fullName", null, "Full Name")}
                  {renderField("status", null, "Status")}
                </div>
                <div className="px-6 py-4">
                  {renderField("location", <TfiLocationPin className="h-6 w-6" />, "Location")}
                  {renderField("phoneNumber", <FiPhoneCall className="h-6 w-6" />, "Phone Number")}
                  {renderField("email", <MdAlternateEmail className="h-6 w-6" />, "Email")}
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Introduction
                    </h3>
                    {isEditing.introduction ? (
                      <div className="flex items-center mt-4">
                        <textarea
                          name="introduction"
                          value={userProfile.introduction}
                          onChange={handleChange}
                          className="block w-full mt-2 border border-gray-300 rounded-md"
                        />
                        <MdSave className="ml-2 text-gray-600 cursor-pointer" onClick={() => handleSave('introduction')} />
                      </div>
                    ) : (
                      <div className="flex items-center mt-4">
                        <p className="text-gray-600">
                          {userProfile.introduction}
                        </p>
                        <MdEdit className="ml-2 text-gray-600 cursor-pointer" onClick={() => toggleEditing('introduction')} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    
  );
}
