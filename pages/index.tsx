import type { NextPage } from "next";
import { useState, useEffect } from "react";

import Head from "next/head";
import Image from "next/image";
import {
  FeatureAttitude,
  InfectionRange,
  filterLicenses,
  License,
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
  Accordion,
} from "react-bootstrap";

import { optionValue, licenseTips } from "../components/helper";

interface List {
  license: License;
  score: number;
}

const Home: NextPage = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [keyIndex, setKeyIndex] = useState(0);
  const [filterOption, setFilterOption] = useState({});
  const [disableDropdown, setDisableDropdown] = useState(false);
  const [lists, setLists] = useState<List[]>([]);

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

  useEffect(() => {
    if (stepIndex === chooseSteps.length) {
      console.log("Selected option:", stepIndex);
      setDisableDropdown(true);
    }
  }, [chooseSteps.length, stepIndex]);

  const handleSelect = (e: string | null) => {
    console.log("handleSelect choice,e", keyIndex, e);

    const choice = e ? (["0", "1", "-1"].includes(e) ? Number(e) : e) : 0;
    console.log(chooseSteps[keyIndex]);
    const key = chooseSteps[keyIndex];
    const newObject = { ...filterOption, [key]: choice };

    console.log(filterOption);

    const tempLists = filterLicenses(newObject);

    // if(stepIndex === chooseSteps.length -1) {
    //   setDisableDropdown(true)
    // }

    setFilterOption({ ...newObject });

    setLists(tempLists);

    setStepIndex(stepIndex < chooseSteps.length ? stepIndex + 1 : stepIndex);

    setKeyIndex(keyIndex < chooseSteps.length - 1 ? keyIndex + 1 : keyIndex);
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
        <p>
          <b>筛选条件</b>
        </p>
      </div>
      <div>
        {licenseTips[chooseSteps[keyIndex]].map((tip) => (
          // eslint-disable-next-line react/jsx-key
          <p>{tip.text}</p>
        ))}
      </div>

      <div>
        <ProgressBar
          id="select-step-progress"
          variant="info"
          now={(keyIndex + 1) * now}
          label={`第${keyIndex + 1}步`}
        />
      </div>
      <br />
      <div>
        <Dropdown onSelect={handleSelect}>
          <Dropdown.Toggle
            disabled={disableDropdown}
            id="dropdown-basic-button"
            title={choose || "请选择"}
          >
            {choose || "请选择"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {optionValue[chooseSteps[keyIndex]].map((info) => (
              // eslint-disable-next-line react/jsx-key
              <Dropdown.Item eventKey={info.value}>{info.text}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {/* <div>
        {lists.map((list, index) => (
          // eslint-disable-next-line react/jsx-key
          <p>
            {list.license.name} 评分: {list.score * 10}
          </p>
        ))}
      </div> */}

      <br />
      <div>
        <Accordion defaultActiveKey="0">
          {lists.map((list, index) => (
            // eslint-disable-next-line react/jsx-key
            <Accordion.Item eventKey={(index + 1).toString()}>
              <Accordion.Header>
                {" "}
                {list.license.name} 评分: {list.score * 10}
              </Accordion.Header>
              <Accordion.Body>{renderInfo(list.license)}</Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
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

function renderInfo(info: License) {
  const key = {
    [InfectionRange.Library]: "Library",
    [InfectionRange.File]: "File",
    [InfectionRange.Module]: "Module",
  };
  return (
    <div>
      <p>{`流行程度: ${
        info.feature.popularity
          ? "Yes"
          : info.feature.popularity === FeatureAttitude.Undefined
          ? "不明确"
          : "No"
      }`}</p>
      <p>{`复用条件: ${
        info.feature.reuseCondition
          ? "Yes"
          : info.feature.reuseCondition === FeatureAttitude.Undefined
          ? "不明确"
          : "No"
      }`}</p>
      <p>{`传染强度: ${
        info.feature.infectionIntensity
          ? "Yes"
          : info.feature.infectionIntensity === FeatureAttitude.Undefined
          ? "不明确"
          : "No"
      }`}</p>
      {info.feature.infectionRange} &&
      <p>{`传染范围: ${
        info.feature.infectionRange in key
          ? key[info.feature.infectionRange]
          : "不明确"
      }`}</p>
      <p>{`法律管辖: ${
        info.feature.jurisdiction
          ? "Yes"
          : info.feature.jurisdiction === FeatureAttitude.Undefined
          ? "不明确"
          : "No"
      }`}</p>
      <p>{`专利声明: ${
        info.feature.patentStatement
          ? "Yes"
          : info.feature.patentStatement === FeatureAttitude.Undefined
          ? "不明确"
          : "No"
      }`}</p>
      <p>{`专利报复: ${
        info.feature.patentRetaliation
          ? "Yes"
          : info.feature.patentRetaliation === FeatureAttitude.Undefined
          ? "不明确"
          : "No"
      }`}</p>
      <p>{`增强署名: ${
        info.feature.enhancedAttribution
          ? "Yes"
          : info.feature.enhancedAttribution === FeatureAttitude.Undefined
          ? "不明确"
          : "No"
      }`}</p>
      <p>{`隐私漏洞: ${
        info.feature.privacyLoophole
          ? "Yes"
          : info.feature.privacyLoophole === FeatureAttitude.Undefined
          ? "不明确"
          : "No"
      }`}</p>
      <p>{`营销背书：${
        info.feature.marketingEndorsement
          ? "Yes"
          : info.feature.marketingEndorsement === FeatureAttitude.Undefined
          ? "不明确"
          : "No"
      }`}</p>
      <a href={info.link}>协议详情</a>
    </div>
  );
}

export default Home;
