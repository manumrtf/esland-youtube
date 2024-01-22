"use client";
import { Category } from "@/types";
import Image from "next/image";
import { useState, useEffect } from "react";
import { gsap } from "gsap";
interface Props {
  categories: Category[];
}

export function CandidatesGrid({ categories }: Props) {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [selectedCandidates, setSelectedCandidates] = useState<
    {
      category: string;
      candidate: string;
    }[]
  >([]);
  const currentCategory = categories[currentCategoryIndex];
  const isLastCategory = currentCategoryIndex === categories.length - 1;
  const isFirstCategory = currentCategoryIndex === 0;
  const [currentCategoryText, setCurrentCategoryText] = useState(
    currentCategory.name
  );
  const maxVotesPerCategory = 4;
  const currentVotes = selectedCandidates.filter(
    (c) => c.category === currentCategory.name
  ).length;
  function nextCategory() {
    if (isLastCategory) {
      //mandar datos
      submitVotes();
      return;
    }

    //Evito el cambio en medio de la animación
    if (gsap.isTweening("#logo_text")) {
      return;
    }

    setCurrentCategoryIndex((current) => current + 1);
  }

  function prevCategory() {
    if (isFirstCategory) {
      return;
    }

    //Evito el cambio en medio de la animación
    if (gsap.isTweening("#logo_text")) {
      return;
    }

    setCurrentCategoryIndex((current) => current - 1);
  }

  function submitVotes() {
    const categoryPositions: { [key: string]: number } = {};

    const data = selectedCandidates.reduce(
      (
        acc: { candidate: string; category: string; position: number }[],
        candidate
      ) => {
        //Inicializar o incrementar la position para la categoría actual
        categoryPositions[candidate.category] =
          (categoryPositions[candidate.category] || 0) + 1;

        acc.push({
          candidate: candidate.candidate,
          category: candidate.category,
          position: categoryPositions[candidate.category],
        });

        return acc;
      },
      []
    );

    fetch("http://localhost:9000/votes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: "user1",
        votes: data,
      }),
    });

    console.log(data);
  }

  function toggleCandidateSelect(category: string, candidate: string) {
    setSelectedCandidates((prev) => {
      //todos los seleccionados para la categoría
      const categoryCandidates = prev.filter((c) => c.category === category);

      // si la categoría ya tiene 4 candidatos y el candidate no está seleccionado
      if (
        categoryCandidates.length >= maxVotesPerCategory &&
        !categoryCandidates.find((c) => c.candidate === candidate)
      ) {
        return prev;
      }

      // el candidato está seleccionado para la categoría
      if (
        prev.find((c) => c.category === category && c.candidate === candidate)
      ) {
        // Me quedo con todos los datos previos, menos este
        return prev.filter(
          (c) => !(c.category === category && c.candidate === candidate)
        );
      }
      //la categoría tiene menos de 4 candidatos y este no está seleccionado
      return [...prev, { category, candidate }];
    });
  }

  function isCandidateSelected(candidate: string) {
    return selectedCandidates.some((c) => c.candidate === candidate);
  }

  function getSelectedCandidatePosition(candidate: string) {
    const candidatesInCurrentCategory = selectedCandidates.filter(
      (c) => c.category === currentCategory.name
    );
    return (
      candidatesInCurrentCategory.findIndex((c) => c.candidate === candidate) +
      1
    );
  }

  // Animaciones

  useEffect(() => {
    //Animacion del grid de candidatos
    gsap.fromTo(
      "#candidate",
      {
        opacity: 0,
        y: 100,
        scale: 0.5,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        scale: 1,
        stagger: 0.1,
        ease: "power2.out",
      }
    );

    //Animaciones del logo

    const tl = gsap.timeline();

    //Primer paso: Parpadeo del texto
    tl.to("#logo_text", {
      opacity: 0,
      repeat: 2,
      duration: 0.1,
      ease: "power2.inOut",
      yoyo: true, // vuelve al estado original tras cada animación
    })
      .then(() => {
        // cuando el texto desaparece, actualizo al nuevo
        setCurrentCategoryText(currentCategory.name);
      })
      .then(() => {
        // Segundo paso: reducir el tamaño del texto a 0
        tl.to("#logo_text", {
          width: 0,
          duration: 0.5,
          ease: "power2.out",
        });

        // Tercer paso: ponemos el tamaño de nuevo a auto
        tl.to("#logo_text", {
          width: "auto",
          duration: 0.5,
          ease: "power2.out",
        });

        //Cuarto paso: hacemos el texto visible de nuevo

        tl.to("#logo_text", {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        });
      });
  }, [currentCategoryIndex, currentCategory.name]);

  return (
    <main className="bg-esland-light-blue min-h-screen xl:bg-esland-cover bg-no-repeat bg-[position:55%,30%] bg-[length:150%] py-4">
      <div className="flex flex-col items-center py-3 sm:py-6">
        <Image
          src={"/assets/corona-top.svg"}
          alt=""
          width={312}
          height={62.5}
          className="w-[262px] h-[40px] sm:h-[62px]"
        />
        <div className="flex justify-center items-center gap-12">
          <Image
            src={"/assets/corona-left.svg"}
            alt=""
            width={90}
            height={240}
            className="w-[45px] h-[120px] sm:w-[90px] sm:h-[240px]"
          />
          <h2
            id="logo_text"
            className="uppercase text-xl font-bold text-white sm:text-2xl sm:tracking-[15px] sm:font-light sm:max-w-[312px] mx-auto text-center sm:leading-relaxed"
          >
            {currentCategoryText}
          </h2>
          <Image
            src={"/assets/corona-right.svg"}
            alt=""
            width={90}
            height={240}
            className="w-[45px] h-[120px] sm:w-[90px] sm:h-[240px]"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 max-w-[672px] mx-auto xl:grid-cols-5 xl:max-w-none xl:w-3/4 mt-4">
        {currentCategory.candidates.map((candidate) => (
          <div
            className="w-full bg-esland-light-blue relative"
            key={candidate.name}
            onClick={() =>
              toggleCandidateSelect(currentCategory.name, candidate.name)
            }
            id="candidate"
          >
            <Image
              src={`/assets/${candidate.clip_cover}`}
              alt=""
              width={198}
              height={111}
              className={`w-full ${
                isCandidateSelected(candidate.name)
                  ? "mix-blend-normal"
                  : "mix-blend-luminosity"
              } hover:mix-blend-normal hover:shadow-candidate-card`}
            />
            <div className="text-center text-sm bg-[#1682c7] text-white py-3">
              <p>{candidate.name}</p>
            </div>
            <span className="bg-esland-light-blue text-white text-xl font-bold absolute top-1 left-1 px-2">
              {getSelectedCandidatePosition(candidate.name) > 0 &&
                getSelectedCandidatePosition(candidate.name)}
            </span>
          </div>
        ))}
      </div>
      <div className="text-white mt-6 flex flex-col items-center lg:flex-row justify-center gap-8">
        <div className="flex items-center justify-center gap-4 ">
          {!isFirstCategory && (
            <button
              className="border-2 px-3 py-1 text-md font-bold"
              onClick={prevCategory}
            >
              {"<"}
            </button>
          )}
          <p className="text-lg font-bold">
            CATEGORIA{" "}
            <span className="text-2xl">
              {currentCategoryIndex + 1}/{categories.length}
            </span>
          </p>

          <button
            className="border-2 px-3 py-1 text-md font-bold"
            onClick={nextCategory}
          >
            {">"}
          </button>
        </div>
        <p className="text-lg font-bold">
          VOTOS REALIZADOS{" "}
          <span className="text-2xl">
            {currentVotes}/{maxVotesPerCategory}
          </span>
        </p>
      </div>
    </main>
  );
}
