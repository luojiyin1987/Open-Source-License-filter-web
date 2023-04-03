import type { NextPage } from "next";
import { useState } from "react";

import Head from "next/head";
import Image from "next/image";
import {
  FeatureAttitude,
  InfectionRange,
  filterLicenses,
} from "license-filter";
import styles from "../styles/Home.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  Container,
  Row,
  Col,
  ProgressBar,
  Dropdown,
  DropdownButton,
  Button,
} from "react-bootstrap";

import { optionValue, licenseTips } from "../components/helper";

const Home: NextPage = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [filterOption, setFilterOption] = useState({});
  const [lists, setLists] = useState([]);
  // const list = filterLicenses({
  //   popularity: FeatureAttitude.Negative,
  //   reuseCondition: FeatureAttitude.Positive,
  //   infectionIntensity: FeatureAttitude.Positive,
  //   infectionRange: InfectionRange.Module,
  //   jurisdiction: FeatureAttitude.Undefined,
  //   patentStatement: FeatureAttitude.Positive,
  //   patentRetaliation: FeatureAttitude.Positive,
  //   enhancedAttribution: FeatureAttitude.Positive,
  //   privacyLoophole: FeatureAttitude.Negative,
  //   marketingEndorsement: FeatureAttitude.Negative,
  // });

  const chooseSteps: string[] = [
    "popularity",
    "reuseCondition",
    "infectionIntensity",
    "infectionRange",
    "jurisdiction",
    "patentStatement",
    "patentRetaliation",
    "enhancedAttribution",
    "privacyLoophole",
    "marketingEndorsement",
  ];

  // rome-ignore lint/style/useConst: <explanation>
  let choose: string | null = null;

  const now = Math.ceil(100 / chooseSteps.length);
  //chooseSteps.map((step)=> console.log(optionValue[step]))

  // console.log("list");
  // console.log(list); // filtered licenses

  const handleSelect = (e: string) => {
    console.log("handleSelect choice,e", stepIndex, e);
    const choice = ["0", "1", "-1"].includes(e) ? Number(e) : e;
    console.log(chooseSteps[stepIndex]);
    const key = chooseSteps[stepIndex];
    const newObject = { ...filterOption, [key]: choice };

    console.log(filterOption);

    const tempLists = filterLicenses(newObject);
    setStepIndex(stepIndex < chooseSteps.length - 1 ? stepIndex + 1 : stepIndex);
    setFilterOption({ ...newObject });
    setLists(tempLists);
    console.log("tempLists", tempLists);
    console.log("list", lists);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>open source license choose</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h2>开源许可证选择器</h2>
      <p>
        该工具旨在帮助用户理解他们自己对于自由和开源软件许可协议的偏好。用户必须自己阅读这些许可协议。在将许可协议适用于您的财产之前，阅读并完全理解您选择的许可协议是非常重要的。支撑该工具运行的许可类型分类，会不可避免地有些缩减。因此，不能也切不可将该工具的输出信息视为法律意见。
      </p>
      <h4 className="warning black">切记：必须阅读并理解您选择的许可协议。</h4>

      <div>
        {licenseTips[chooseSteps[stepIndex]].map((tip) => (
          <p>{tip.text}</p>
        ))}
      </div>

      <div>
        <ProgressBar
          id="select-step-progress"
          variant="info"
          now={(stepIndex + 1) * now}
          label={`第${stepIndex + 1}步`}
        />
      </div>

      <div>
        <Dropdown onSelect={handleSelect}>
          <Dropdown.Toggle
            id="dropdown-basic-button"
            title={choose || "请选择"}
          >
            {choose || "请选择"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {optionValue[chooseSteps[stepIndex]].map((info) => (
              <Dropdown.Item eventKey={info.value}>{info.text}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div>
        {lists.map((list, index) => (
          <p>
            {list.license.name} score: {list.score * 10}
          </p>
        ))}
      </div>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
