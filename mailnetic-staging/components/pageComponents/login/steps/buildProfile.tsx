import React, { useEffect, useMemo, useState } from "react";
import { colors } from "../../../../styles";
import Input from "../../../Input";
import TextArea from "../../../TextArea";
import TagInput from "../../../TagInput";
import { UserConfig, updateUser } from "../../../../utils";
import Button from "../../../button";
import firebase from "firebase/compat/app";
import { useLoader } from "../../../../utils/providers";
import  Router from "next/router";

export const BuildProfile = () => {
  const currentUser = firebase.auth().currentUser;
  const [descriptionTags, setDescriptionTags] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const { startLoader, stopLoader } = useLoader();

  useEffect(() => {
    setName(currentUser?.displayName);
  }, [currentUser]);

  const onSave = async () => {
    if (disabled) return;
    startLoader();
    setButtonLoading(true);
    const user = {
      email: currentUser?.email,
      photoUrl: currentUser?.photoURL,
      name,
      jobTitle,
      description: descriptionTags,
      company: { name: companyName, description: companyDescription },
      emailAccounts : []
    };
    await updateUser(user);
    setButtonLoading(false);
    stopLoader();
    Router.push({
      pathname: "/home",
    });
  };

  useEffect(() => {
    if (
      name?.length > 0 &&
      companyName?.length > 0 &&
      descriptionTags?.length > 0 &&
      jobTitle?.length > 0 &&
      companyDescription?.length > 10
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name, companyName, descriptionTags, jobTitle, companyDescription]);

  return (
    <>
      <div className="content-child-container-pre-login">
        <p className="text-5xl mt-12 mb-6 text-center font-medium">
          🛠️️ We’ll need you to
          <br />
          build your profile
        </p>
        <div className="flex-1 mb-2 w-full">
          <div className="flex-row flex w-full">
            <Input
              containerClass="mr-2"
              label="What's your name?"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              containerClass="ml-2"
              label="What’s your job title??"
              placeholder="Job Title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
          <Input
            label="What’s your company called ?"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <TagInput
            tags={descriptionTags}
            setTags={(e) => {
              if (descriptionTags?.length < 4) {
                setDescriptionTags(e);
              } else {
              }
            }}
            label="How would you describe yourself?"
            placeholder="Start typing to select keywords..."
          />
          <TextArea
            value={companyDescription}
            onChange={(e) => setCompanyDescription(e.target.value)}
            label="What does your company do?"
            placeholder="Eg: A creative branding and development agency with a focus on web3 and AI"
          />
        </div>
        <Button
          onPress={onSave}
          loading={buttonLoading}
          disabled={disabled}
          title="Let's Start"
          preset="primary"
          containerStyle={{ width: "100%", marginBottom: "20px" }}
        />
        <p className="text-light">
          The information you provide here will be used as the
          <br />
          <p style={{ color: colors.primary }}>'Sender'</p> details for our AI
          when drafting emails.
        </p>
      </div>
    </>
  );
};

export const TagSelector = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  return (
    <div>
      <Input
        label="How would you describe yourself?"
        placeholder="Start typing to select keywords..."
      />
      <div className="flex-row flex-1 flex">
        {selectedTags.map((i) => (
          <div className="">{i}</div>
        ))}
      </div>
    </div>
  );
};
