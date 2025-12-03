import React, { useState } from "react";
import { Wheel } from "react-custom-roulette";

type Rarity = "common" | "rare" | "mythic" | "legendary";

type Gift = {
  id: string;
  name: string;
  rarity: Rarity;
  approxPriceStars: number;
  imageUrl: string;
  dropChance: number;
};

type CaseDef = {
  id: string;
  name: string;
  description: string;
  priceStars: number;
  imageUrl: string;
  gifts: Gift[];
};

type InventoryItem = {
  id: string;
  giftId: string;
  name: string;
  rarity: Rarity;
  imageUrl: string;
  approxPriceStars: number;
  obtainedAt: string;
};

type TabId = "home" | "inventory" | "tasks" | "profile";

const TABS: { id: TabId; label: string }[] = [
  { id: "home", label: "Кейсы" },
  { id: "inventory", label: "Инвентарь" },
  { id: "tasks", label: "Задания" },
  { id: "profile", label: "Профиль" },
];

const rarityLabel: Record<Rarity, string> = {
  common: "Обычный",
  rare: "Редкий",
  mythic: "Мифический",
  legendary: "Легендарный",
};

const rarityColor: Record<Rarity, string> = {
  common: "#9CA3AF",
  rare: "#38BDF8",
  mythic: "#A855F7",
  legendary: "#F59E0B",
};

const CASES: CaseDef[] = [
  {
    id: "new-year",
    name: "New Year Drop",
    description: "Праздничные подарки и стикеры к Новому году.",
    priceStars: 500,
    imageUrl: "/images/cases/new-year.png",
    gifts: [
      {
        id: "ny-hat",
        name: "Santa Hat",
        rarity: "common",
        approxPriceStars: 200,
        imageUrl: "/images/gifts/santa-hat.png",
        dropChance: 0.55,
      },
      {
        id: "ny-fireworks",
        name: "Fireworks Scene",
        rarity: "rare",
        approxPriceStars: 750,
        imageUrl: "/images/gifts/fireworks.png",
        dropChance: 0.3,
      },
      {
        id: "ny-golden-tree",
        name: "Golden Tree",
        rarity: "legendary",
        approxPriceStars: 3000,
        imageUrl: "/images/gifts/golden-tree.png",
        dropChance: 0.15,
      },
    ],
  },
  {
    id: "memes",
    name: "Meme Pack",
    description: "Мемные подарки и коллекционный арт.",
    priceStars: 800,
    imageUrl: "/images/cases/memes.png",
    gifts: [
      {
        id: "mm-clown",
        name: "Clown Moment",
        rarity: "common",
        approxPriceStars: 150,
        imageUrl: "/images/gifts/clown.png",
        dropChance: 0.7,
      },
      {
        id: "mm-doge",
        name: "Doge Rocket",
        rarity: "mythic",
        approxPriceStars: 2500,
        imageUrl: "/images/gifts/doge-rocket.png",
        dropChance: 0.22,
      },
      {
        id: "mm-pepe",
        name: "Gold Pepe",
        rarity: "legendary",
        approxPriceStars: 6500,
        imageUrl: "/images/gifts/gold-pepe.png",
        dropChance: 0.08,
      },
    ],
  },
  {
    id: "ton-whales",
    name: "TON Whales",
    description: "Подарки для тон‑максималистов.",
    priceStars: 1500,
    imageUrl: "/images/cases/ton-whales.png",
    gifts: [
      {
        id: "tw-star-rain",
        name: "Star Rain",
        rarity: "common",
        approxPriceStars: 300,
        imageUrl: "/images/gifts/star-rain.png",
        dropChance: 0.25,
      },
      {
        id: "tw-diamond-hands",
        name: "Diamond Hands",
        rarity: "rare",
        approxPriceStars: 1200,
        imageUrl: "/images/gifts/diamond-hands.png",
        dropChance: 0.4,
      },
      {
        id: "tw-ton-whale",
        name: "TON Whale",
        rarity: "mythic",
        approxPriceStars: 4000,
        imageUrl: "/images/gifts/ton-whale.png",
        dropChance: 0.35,
      },
    ],
  },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  const [balanceTon] = useState<number>(123.45);
  const [balanceStars, setBalanceStars] = useState<number>(20_000);

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isOpening, setIsOpening] = useState(false);

  const [selectedCase, setSelectedCase] = useState<CaseDef | null>(null);
  const [showCaseModal, setShowCaseModal] = useState(false);

  const [lastDrop, setLastDrop] = useState<InventoryItem | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);

  const [wheelMustSpin, setWheelMustSpin] = useState(false);
  const [wheelPrizeIndex, setWheelPrizeIndex] = useState(0);

  function openCaseModal(caseDef: CaseDef) {
    if (isOpening) return;
    setSelectedCase(caseDef);
    setShowCaseModal(true);
  }

  function rollGiftIndexByChance(caseDef: CaseDef): number {
    const roll = Math.random();
    let acc = 0;
    let pickedIndex = 0;

    caseDef.gifts.forEach((g, idx) => {
      acc += g.dropChance;
      if (roll <= acc && pickedIndex === 0) {
        pickedIndex = idx;
      }
    });

    return pickedIndex;
  }

  function handleBuyAndOpenCase() {
    if (!selectedCase || isOpening) return;

    if (balanceStars < selectedCase.priceStars) {
      alert("Недостаточно Stars для открытия этого кейса.");
      return;
    }

    const prizeIndex = rollGiftIndexByChance(selectedCase);

    setBalanceStars((prev) => prev - selectedCase.priceStars);
    setIsOpening(true);
    setShowCongrats(false);

    setWheelPrizeIndex(prizeIndex);
    setWheelMustSpin(true);
  }

  function handleWheelStop() {
    if (!selectedCase) {
      setIsOpening(false);
      return;
    }

    const droppedGift = selectedCase.gifts[wheelPrizeIndex];

    const item: InventoryItem = {
      id: `${droppedGift.id}-${Date.now()}`,
      giftId: droppedGift.id,
      name: droppedGift.name,
      rarity: droppedGift.rarity,
      imageUrl: droppedGift.imageUrl,
      approxPriceStars: droppedGift.approxPriceStars,
      obtainedAt: new Date().toISOString(),
    };

    setInventory((prev) => [item, ...prev]);
    setLastDrop(item);
    setIsOpening(false);
    setShowCaseModal(false);
    setShowCongrats(true);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "24px 16px 80px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <header>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            TG Cases
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--color-text-secondary)",
              marginTop: 8,
            }}
          >
            Открывай кейсы с Telegram‑подарками за Stars и TON.
          </p>
        </header>

        <section
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <BalanceBadge
            label="Баланс Stars"
            value={`${balanceStars.toLocaleString("ru-RU")} ⭐`}
          />
          <BalanceBadge
            label="Баланс TON"
            value={`${balanceTon.toLocaleString("ru-RU")} TON`}
          />
        </section>

        <main style={{ flex: 1 }}>
          {activeTab === "home" && (
            <CasesScreen
              cases={CASES}
              isOpening={isOpening}
              lastDrop={lastDrop}
              onCaseClick={openCaseModal}
            />
          )}
          {activeTab === "inventory" && (
            <InventoryScreen items={inventory} />
          )}
          {activeTab === "tasks" && <TasksScreen />}
          {activeTab === "profile" && (
            <ProfileScreen
              balanceStars={balanceStars}
              balanceTon={balanceTon}
              inventoryCount={inventory.length}
            />
          )}
        </main>

        <BottomTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {showCaseModal && selectedCase && (
          <CaseModal
            caseDef={selectedCase}
            isOpening={isOpening}
            wheelMustSpin={wheelMustSpin}
            wheelPrizeIndex={wheelPrizeIndex}
            setWheelMustSpin={setWheelMustSpin}
            onWheelStop={handleWheelStop}
            onClose={() => !isOpening && setShowCaseModal(false)}
            onBuy={handleBuyAndOpenCase}
          />
        )}

        {showCongrats && lastDrop && (
          <CongratsModal
            item={lastDrop}
            onClose={() => setShowCongrats(false)}
          />
        )}
      </div>
    </div>
  );
};

const BalanceBadge: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div
    style={{
      borderRadius: 16,
      padding: 12,
      backgroundColor: "var(--color-surface)",
      border: "1px solid var(--color-border-subtle)",
      minWidth: 180,
    }}
  >
    <p
      style={{
        fontSize: 11,
        color: "var(--color-text-muted)",
        margin: 0,
      }}
    >
      {label}
    </p>
    <p style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{value}</p>
  </div>
);

const BottomTabs: React.FC<{
  activeTab: TabId;
  setActiveTab: (id: TabId) => void;
}> = ({ activeTab, setActiveTab }) => (
  <div
    style={{
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 16,
      display: "flex",
      justifyContent: "center",
      pointerEvents: "none",
    }}
  >
    <nav
      aria-label="Основные разделы приложения"
      style={{
        display: "flex",
        gap: 8,
        padding: "12px 16px",
        borderRadius: 16,
        backgroundColor: "rgba(30,30,46,0.9)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 18px 45px rgba(15,23,42,0.85)",
        pointerEvents: "auto",
      }}
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setActiveTab(tab.id)}
          aria-current={tab.id === activeTab ? "page" : undefined}
          style={{
            flex: 1,
            borderRadius: 9999,
            padding: "8px 12px",
            fontSize: 13,
            transition: "all 0.18s ease-out",
            backgroundColor:
              tab.id === activeTab ? "var(--color-accent)" : "transparent",
            color:
              tab.id === activeTab
                ? "#ffffff"
                : "var(--color-text-secondary)",
          }}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  </div>
);

const CasesScreen: React.FC<{
  cases: CaseDef[];
  isOpening: boolean;
  lastDrop: InventoryItem | null;
  onCaseClick: (c: CaseDef) => void;
}> = ({ cases, isOpening, lastDrop, onCaseClick }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    {lastDrop && (
      <section
        style={{
          borderRadius: 16,
          padding: 12,
          backgroundColor: "var(--color-surface-soft)",
          border: "1px solid rgba(34,197,94,0.4)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <img
          src={lastDrop.imageUrl}
          alt={lastDrop.name}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            objectFit: "cover",
          }}
        />
        <div>
          <p
            style={{
              fontSize: 12,
              margin: 0,
              color: "var(--color-success)",
            }}
          >
            Поздравляем! Выпал{" "}
            <span style={{ color: rarityColor[lastDrop.rarity] }}>
              {lastDrop.name}
            </span>
            .
          </p>
          <p
            style={{
              fontSize: 11,
              margin: 0,
              color: "var(--color-text-muted)",
            }}
          >
            Примерная стоимость: {lastDrop.approxPriceStars} ⭐
          </p>
        </div>
      </section>
    )}

    <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <h2
        style={{
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-text-muted)",
          margin: 0,
        }}
      >
        Кейсы
      </h2>
      <div
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          paddingBottom: 4,
        }}
      >
        {cases.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onCaseClick(c)}
            disabled={isOpening}
            style={{
              minWidth: 240,
              borderRadius: 20,
              padding: 14,
              textAlign: "left",
              backgroundColor: "var(--color-surface)",
              border: "1px solid rgba(148,163,184,0.35)",
              opacity: isOpening ? 0.7 : 1,
              cursor: isOpening ? "wait" : "pointer",
            }}
          >
            <div
              style={{
                borderRadius: 16,
                overflow: "hidden",
                marginBottom: 10,
              }}
            >
              <img
                src={c.imageUrl}
                alt={c.name}
                style={{
                  width: "100%",
                  height: 110,
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{c.name}</p>
            <p
              style={{
                fontSize: 12,
                color: "var(--color-text-muted)",
                marginTop: 4,
                marginBottom: 8,
              }}
            >
              {c.description}
            </p>
            <p
              style={{
                fontSize: 12,
                color: "var(--color-text-secondary)",
                margin: 0,
              }}
            >
              Цена открытия: {c.priceStars.toLocaleString("ru-RU")} ⭐
            </p>
          </button>
        ))}
      </div>
    </section>
  </div>
);

const CaseModal: React.FC<{
  caseDef: CaseDef;
  isOpening: boolean;
  wheelMustSpin: boolean;
  wheelPrizeIndex: number;
  setWheelMustSpin: (v: boolean) => void;
  onWheelStop: () => void;
  onClose: () => void;
  onBuy: () => void;
}> = ({
  caseDef,
  isOpening,
  wheelMustSpin,
  wheelPrizeIndex,
  setWheelMustSpin,
  onWheelStop,
  onClose,
  onBuy,
}) => {
  const totalChance = caseDef.gifts.reduce(
    (acc, g) => acc + g.dropChance,
    0
  );

  const wheelData = caseDef.gifts.map((gift) => ({
    option: gift.name,
    style: {
      backgroundColor: rarityColor[gift.rarity],
      textColor: "#e5e7eb",
    },
    optionSize: (gift.dropChance / totalChance) * 100,
  }));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15,23,42,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 40,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 960,
          margin: "0 16px",
          borderRadius: 20,
          backgroundColor: "var(--color-surface)",
          boxShadow: "var(--shadow-soft)",
          padding: 20,
          position: "relative",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isOpening}
          style={{
            position: "absolute",
            right: 12,
            top: 8,
            fontSize: 18,
            cursor: "pointer",
            opacity: isOpening ? 0.4 : 0.8,
          }}
        >
          ×
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(260px, 320px) minmax(280px, 1fr)",
            gap: 18,
          }}
        >
          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <img
              src={caseDef.imageUrl}
              alt={caseDef.name}
              style={{
                width: "100%",
                height: 220,
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>

          <div>
            <h2
              style={{
                fontSize: 18,
                margin: "0 0 4px",
              }}
            >
              {caseDef.name}
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "var(--color-text-secondary)",
                margin: "0 0 12px",
              }}
            >
              {caseDef.description}
            </p>

            <p
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--color-text-muted)",
                margin: "0 0 4px",
              }}
            >
              Подарки внутри
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))",
                gap: 10,
                maxHeight: 220,
                overflowY: "auto",
                marginBottom: 8,
              }}
            >
              {caseDef.gifts.map((gift) => (
                <div
                  key={gift.id}
                  style={{
                    borderRadius: 14,
                    padding: 8,
                    backgroundColor: "var(--color-surface-soft)",
                    border: `1px solid ${rarityColor[gift.rarity]}33`,
                  }}
                >
                  <img
                    src={gift.imageUrl}
                    alt={gift.name}
                    style={{
                      width: "100%",
                      height: 70,
                      borderRadius: 10,
                      objectFit: "cover",
                    }}
                  />
                  <p
                    style={{
                      margin: "6px 0 0",
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    {gift.name}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 11,
                      color: rarityColor[gift.rarity],
                    }}
                  >
                    {rarityLabel[gift.rarity]}
                  </p>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: 11,
                      color: "var(--color-text-muted)",
                    }}
                  >
                    ≈ {gift.approxPriceStars} ⭐
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Рулетка 400x400 */}
        <div
          style={{
            marginTop: 18,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 400,
              height: 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Wheel
              mustStartSpinning={wheelMustSpin}
              prizeNumber={wheelPrizeIndex}
              data={wheelData}
              outerBorderColor="#020617"
              outerBorderWidth={3}
              radiusLineColor="#020617"
              radiusLineWidth={1}
              backgroundColors={["#020617", "#111827"]}
              textDistance={68}
              fontSize={12}
              perpendicularText
              spinDuration={0.7}
              onStopSpinning={() => {
                setWheelMustSpin(false);
                onWheelStop();
              }}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "var(--color-text-secondary)",
            }}
          >
            Цена открытия:{" "}
            <span style={{ fontWeight: 600 }}>
              {caseDef.priceStars.toLocaleString("ru-RU")} ⭐
            </span>
          </p>
          <button
            type="button"
            onClick={onBuy}
            disabled={isOpening}
            style={{
              padding: "10px 20px",
              borderRadius: 9999,
              background:
                "linear-gradient(135deg, var(--color-accent), #4f46e5)",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 600,
              cursor: isOpening ? "wait" : "pointer",
              opacity: isOpening ? 0.7 : 1,
            }}
          >
            {isOpening ? "Открываем..." : "Купить кейс"}
          </button>
        </div>
      </div>
    </div>
  );
};

const CongratsModal: React.FC<{
  item: InventoryItem;
  onClose: () => void;
}> = ({ item, onClose }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(15,23,42,0.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 50,
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        margin: "0 16px",
        borderRadius: 20,
        backgroundColor: "var(--color-surface)",
        boxShadow: "var(--shadow-soft)",
        padding: 20,
        textAlign: "center",
        position: "relative",
      }}
    >
      <button
        type="button"
        onClick={onClose}
        style={{
          position: "absolute",
          right: 12,
          top: 8,
          fontSize: 18,
          cursor: "pointer",
        }}
      >
        ×
      </button>
      <p
        style={{
          fontSize: 12,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-text-muted)",
          margin: "0 0 8px",
        }}
      >
        Поздравляем!
      </p>
      <h2
        style={{
          fontSize: 20,
          margin: "0 0 12px",
        }}
      >
        Тебе выпал подарок
      </h2>

      <div
        style={{
          borderRadius: 16,
          padding: 12,
          marginBottom: 12,
          background:
            "radial-gradient(circle at top, rgba(99,102,241,0.25), transparent 60%)",
        }}
      >
        <img
          src={item.imageUrl}
          alt={item.name}
          style={{
            width: 160,
            height: 160,
            borderRadius: 18,
            objectFit: "cover",
            display: "block",
            margin: "0 auto 8px",
          }}
        />
        <p
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          {item.name}
        </p>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: 13,
            color: rarityColor[item.rarity],
          }}
        >
          {rarityLabel[item.rarity]}
        </p>
      </div>

      <p
        style={{
          fontSize: 13,
          margin: "0 0 12px",
          color: "var(--color-text-secondary)",
        }}
      >
        Примерная стоимость:{" "}
        <span style={{ fontWeight: 600 }}>
          {item.approxPriceStars.toLocaleString("ru-RU")} ⭐
        </span>
      </p>

      <button
        type="button"
        onClick={onClose}
        style={{
          padding: "10px 20px",
          borderRadius: 9999,
          backgroundColor: "var(--color-accent)",
          color: "#ffffff",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Забрать в инвентарь
      </button>
    </div>
  </div>
);

const InventoryScreen: React.FC<{ items: InventoryItem[] }> = ({ items }) => (
  <div
    style={{
      borderRadius: 16,
      padding: 16,
      backgroundColor: "var(--color-surface)",
    }}
  >
    <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 0 }}>Инвентарь</h2>
    {items.length === 0 ? (
      <p style={{ fontSize: 14, color: "var(--color-text-muted)", margin: 0 }}>
        Пока пусто. Открой несколько кейсов, чтобы собрать коллекцию.
      </p>
    ) : (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 12,
          marginTop: 8,
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              borderRadius: 14,
              padding: 10,
              backgroundColor: "var(--color-surface-soft)",
              border: `1px solid ${rarityColor[item.rarity]}33`,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              style={{
                width: "100%",
                height: 90,
                borderRadius: 10,
                objectFit: "cover",
              }}
            />
            <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>
              {item.name}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: rarityColor[item.rarity],
              }}
            >
              {rarityLabel[item.rarity]}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "var(--color-text-muted)",
              }}
            >
              ≈ {item.approxPriceStars} ⭐
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
);

const TasksScreen: React.FC = () => (
  <div
    style={{
      borderRadius: 16,
      padding: 16,
      backgroundColor: "var(--color-surface)",
    }}
  >
    <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 0 }}>Задания</h2>
    <p style={{ fontSize: 14, color: "var(--color-text-muted)", margin: 0 }}>
      Здесь будут Telegram‑задания и рефералка. Пока заглушка.
    </p>
  </div>
);

const ProfileScreen: React.FC<{
  balanceStars: number;
  balanceTon: number;
  inventoryCount: number;
}> = ({ balanceStars, balanceTon, inventoryCount }) => (
  <div
    style={{
      borderRadius: 16,
      padding: 16,
      backgroundColor: "var(--color-surface)",
    }}
  >
    <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 0 }}>
      Профиль и статистика
    </h2>
    <p style={{ fontSize: 14, margin: 0 }}>
      Stars:{" "}
      <span style={{ fontWeight: 600 }}>
        {balanceStars.toLocaleString("ru-RU")} ⭐
      </span>
    </p>
    <p style={{ fontSize: 14, marginTop: 4 }}>
      TON:{" "}
      <span style={{ fontWeight: 600 }}>
        {balanceTon.toLocaleString("ru-RU")} TON
      </span>
    </p>
    <p style={{ fontSize: 14, marginTop: 4 }}>
      Предметов в инвентаре:{" "}
      <span style={{ fontWeight: 600 }}>{inventoryCount}</span>
    </p>
  </div>
);

export default App;
