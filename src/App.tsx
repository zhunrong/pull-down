import { FC, useEffect, useState } from "react";
import "./App.css";
import { PullDown } from "./PullDown";
import star from "./star.jpeg";
import doge from "./doge.png";

const Banner: FC<{ loading?: boolean }> = ({ loading }) => {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <img src={star} style={{ height: "100%" }} alt="" />
      {loading && (
        <img
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: "-32px",
            marginLeft: "-32px",
            animation: "doge 0.5s infinite",
          }}
          src={doge}
          alt=""
        />
      )}
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(false);

  const onRefresh = () => {
    return new Promise<void>((resolve) => {
      // 执行刷新逻辑
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        resolve();
      }, 1000);
    });
  };

  return (
    <PullDown
      bannerHeight={180}
      bannerMaxHeight={240}
      bannerBg={<img src={star} alt="" />}
      bannerLoading={
        loading && (
          <img
            style={{
              marginTop: "-32px",
              marginLeft: "-32px",
              animation: "doge 0.5s infinite",
            }}
            src={doge}
            alt=""
          />
        )
      }
      onRefresh={onRefresh}
    >
      <div style={{ padding: "15px" }}>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut doloremque
        veritatis porro quae delectus nobis rem id facilis ex. Repudiandae
        consequatur voluptates itaque distinctio exercitationem aliquam iusto
        qui, eum consectetur! Dolores modi numquam totam, possimus voluptatum
        laudantium officia itaque ipsam similique ut! Ratione expedita ipsa,
        nesciunt quae omnis quibusdam blanditiis itaque delectus aspernatur
        commodi ducimus tempora velit animi harum exercitationem. Pariatur
        cupiditate sint rerum sit, quis repellat vitae eos optio qui quidem!
        Eligendi autem cupiditate corporis aliquam, dignissimos debitis qui.
        Quas quaerat reiciendis minima tempora sed cumque voluptas. At, labore.
        Quibusdam excepturi molestiae error libero nemo facilis eum eveniet.
        Repellat consequuntur atque vero porro quae alias quod dolor quidem.
        Modi culpa, iure facere hic doloremque pariatur optio alias at
        molestias. Eligendi quod ea consequuntur vel possimus, incidunt enim
        sapiente suscipit repellendus nulla quaerat eveniet architecto rerum
        corporis, sint sequi sed dolore animi officia eos cumque aliquid
        facilis! Nobis, facilis quisquam? Nihil est eum quisquam placeat
        accusantium iusto recusandae autem explicabo, aut quod ex ducimus
        blanditiis laborum, id quo ullam animi necessitatibus dolor soluta nisi
        doloribus illum repudiandae! Dolore, at? Maiores. Earum quam
        necessitatibus in enim esse quibusdam quisquam consequatur quo commodi
        eius! Soluta tempora, inventore totam, itaque est ipsam qui dicta
        maiores voluptatibus, accusamus mollitia necessitatibus animi officiis!
        Nesciunt, at? Molestiae, dicta! Eos veniam est molestiae provident,
        quidem sequi error dolorem eveniet assumenda dolores ratione enim
        corporis culpa atque molestias quas commodi nulla ab voluptates at
        quibusdam sunt soluta fugiat. Voluptas soluta voluptatum tempore
        molestiae commodi voluptatibus incidunt. Inventore fugit aut facilis
        odio ducimus voluptates, officiis voluptatum quisquam debitis molestiae
        nostrum, dicta saepe doloribus ex sapiente quos consequatur, optio
        veritatis! Fugit alias, reprehenderit expedita quos iure ratione
        repellendus inventore provident qui placeat suscipit officia, debitis
        laudantium? Corporis error officiis sit nulla, temporibus mollitia
        necessitatibus iusto illum aliquid laborum nisi quo! Earum temporibus
        fugit laboriosam omnis aspernatur tempore a necessitatibus. Provident
        tenetur qui officia at ipsam doloribus. Eos, necessitatibus. Impedit
        facilis excepturi debitis nesciunt numquam blanditiis id omnis
        repellendus quidem voluptate. Sed eligendi veniam totam harum. Facere id
        quos consectetur quam est. Id tenetur iste consectetur velit? Asperiores
        ea et esse. Atque ipsam ex molestias, illo recusandae libero minima
        laudantium iusto! Cum minus soluta ex molestias enim molestiae. Non
        sunt, veniam dolore qui sequi optio, ipsa nulla sapiente nihil expedita
        nemo perspiciatis alias magni animi quae! Porro a aspernatur nobis non?
        Optio, obcaecati alias. Porro repellendus numquam aliquam aperiam ex.
        Eligendi, repellendus, vero illo officia incidunt ab ad alias, voluptate
        adipisci laudantium obcaecati quasi saepe beatae perferendis corporis et
        a voluptatem. Delectus nostrum soluta debitis ab sunt atque enim, autem
        fugiat voluptates cumque accusantium esse beatae consequuntur alias
        voluptatum minus vero necessitatibus! Possimus rem accusantium earum
        doloribus cupiditate, itaque ut vitae! Unde odio autem cum quas quasi
        beatae, tempora quae laboriosam rerum minus voluptatum recusandae?
        Consequatur fuga in maiores, adipisci voluptatibus ab doloremque quod
        quos optio! Laborum eligendi fuga dicta earum? A earum quibusdam
        aspernatur omnis aliquam quo suscipit corporis error beatae fuga.
        Accusantium, praesentium delectus dolorum, odit veritatis perspiciatis
        voluptate suscipit repellendus unde iusto magnam in, sed saepe!
        Recusandae, doloribus? Deserunt corrupti, laudantium quasi labore hic
        molestiae explicabo nobis doloremque eum beatae perspiciatis culpa
        deleniti, nam quia odit temporibus, facilis mollitia dolores iste sunt
        placeat aliquid. Adipisci dolores vero amet. Natus saepe nam aut neque
        illo maxime sed veniam, error architecto numquam soluta accusamus itaque
        minima magnam magni laudantium odio consequuntur asperiores labore.
        Eveniet itaque perferendis obcaecati, debitis cum labore! Placeat
        dolorum voluptatum vero odit explicabo magni sunt neque incidunt
        veritatis fugit corrupti laudantium, rerum perspiciatis accusamus
        necessitatibus debitis hic illum ab eveniet nisi ducimus autem aut.
        Magni, saepe iste. Magni minima eius voluptatem maiores porro! Eveniet
        officiis assumenda facere expedita possimus, asperiores voluptatum
        cumque atque id mollitia ipsum obcaecati. Adipisci, libero placeat
        doloribus accusamus tenetur quos tempora officiis molestias. Debitis,
        consequatur veritatis ipsa doloribus itaque eius magnam vero
        perspiciatis non ab nihil aspernatur labore quos libero, amet minima
        animi veniam, architecto iste earum reiciendis voluptatum. Quo sed
        exercitationem vel! In, non sapiente error earum atque neque rerum
        facere expedita iusto assumenda. Consectetur labore, repellendus
        voluptatum harum ea officiis incidunt temporibus enim facere! Officiis
        libero ex omnis sapiente quas minus. Impedit commodi minima adipisci
        facere, perferendis deserunt laborum quibusdam accusamus dignissimos
        porro nulla nobis iste cupiditate! Quis quam rerum ducimus ipsum, saepe
        odit? Porro laborum asperiores quis magni modi eligendi? Atque est
        assumenda omnis. Aperiam officia voluptate eum perferendis ea,
        repellendus, quam quis enim laudantium obcaecati recusandae ratione
        deleniti et autem dignissimos illo modi ab, vitae quas tempora animi!
        Temporibus. Omnis necessitatibus unde praesentium? Ipsum odio
        repellendus, assumenda id maiores laborum, error provident, vitae
        quibusdam porro veritatis laudantium totam maxime. Accusantium, vel modi
        labore quisquam quis dignissimos maiores porro velit? Placeat itaque
        ratione consectetur officiis distinctio in, iure dicta. Eligendi
        aspernatur ipsam fuga ab accusantium animi rem eaque laborum doloribus
        consequatur cum sit, quisquam a distinctio neque non nihil qui?
        Doloribus sequi quia fuga atque. Doloremque esse ea libero enim
        asperiores necessitatibus inventore suscipit reprehenderit dolore
        dolorem excepturi corrupti soluta cumque amet perferendis labore maxime
        autem, praesentium eveniet nemo provident? Inventore tenetur libero
        praesentium reprehenderit saepe culpa delectus cupiditate quaerat non
        error ex eligendi, nostrum aperiam assumenda adipisci veritatis,
        deleniti laboriosam, vero sed. Molestias magnam amet necessitatibus
        deleniti doloribus libero! Repellendus impedit numquam doloremque quod
        natus at, possimus quasi aut quidem fugiat vero repudiandae ut. Ullam
        accusamus, odio eaque magnam ut aspernatur atque, laboriosam repellendus
        labore libero consequatur qui et?
      </div>
    </PullDown>
  );
}

export default App;
