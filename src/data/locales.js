// TODO: Add support for more languages (Spanish, French, Portuguese common in CrossFit)
export const LOCALES = {
    en: {
        duration: "Duration",
        movements: "Movements",
        includeStrength: "Include Strength (Part A)",
        strengthSub: "Heavy compound lift before WOD",
        level: "Level",
        style: "Workout Style",
        focus: "Focus",
        injuries: "Injuries",
        gear: "Gear",
        generate: "Generate WOD",
        rx: "Rx (Standard)",
        scaled: "Scaled",
        beginner: "Beginner",
        random: "Surprise Me (Random)",
        chipper: "Chipper",
        tabata: "Tabata",
        ladder: "Ladder",
        deathBy: "Death By",
        partnerMode: "Partner Edition",
        partnerSub: "Double volume, split with a friend",
        focusTypes: { balanced: "Balanced", cardio: "Cardio", strength: "Strength", gymnastics: "Gymnastics", core: "Core" },
        parts: { shoulders: "Shoulders", knees: "Knees", back: "Back" },
        equip: { barbell: "Barbell", dumbbell: "Dumbbells / KBs", pullup: "Pull-Up Bar", machine: "Cardio Machine" },
        audioSettings: {
            countdowns: "Countdowns (3-2-1)",
            announcements: "Announcements (Next, Rest)",
            beeps: "Transition Beeps"
        },
        tt: {
            injuries: "Smart-Filter: Excludes aggravating movements.",
            level: "Rx uses 100% standard volume. Scaled reduces reps to 60% and simplifies complex movements.",
            focus: "Biases the random selection generator towards specific movement patterns (e.g., more running/burpees for Cardio).",
            strength: "Smart Pairing: Selects a lift that complements the Metcon (e.g., if Metcon is leg-heavy, it picks an upper-body or hinge lift).",
            buyIn: "A single exercise performed once at the beginning of the workout, before the main conditioning rounds."
        },
        calculator: "1 Rep Max",
        weight: "Weight",
        reps: "Reps",
        calculate: "Calculate",
        estimated1RM: "Estimated 1 Rep Max",
        percentages: "Percentages",
        screens: {
            activeTimer: {
                greatJob: "Great Job",
                completeMsg: "Workout Complete. Log it.",
                score: "Score / Notes",
                save: "Save",
                cancel: "Cancel",
                rest: "REST",
                workMode: "WORK",
                rounds: "Rounds",
                next: "Up Next:",
                confirmExit: "Quit workout?",
                yesExit: "Yes, Quit",
                noStay: "No, Stay"
            },
            preview: {
                back: "Back",
                partA: "Part A",
                partB: "Part B",
                strength: "Strength",
                conditioning: "Conditioning",
                share: "Share",
                copied: "Copied",
                min: "Mins",
                rounds: "Rounds",
                warmup: "Warmup Protocol",
                start: "Start Timer",
                save: "Save",
                saved: "Saved",
                reroll: "Reroll",
                rerollConfirm: "Tap again!",
                selectSwap: "Select Replacement",
                whySwap: "Matches movement pattern & equipment",
                explanations: {
                    strengthTitle: "Smart Strength Pairing",
                    strengthText: "We analyze the movement patterns in your conditioning workout and pair a complementary strength exercise. For example, if your Metcon is leg-heavy (Squats), we might prescribe a Push or Hinge movement to keep you balanced and avoid over-fatigue.",
                    metconTitle: "Dynamic Conditioning",
                    metconText: "This workout is scaled to your selected duration and difficulty. Rep schemes are adjusted based on the total volume to maintain the intended stimulus (e.g., sprinting vs. pacing).",
                    warmupTitle: "Targeted Warmup",
                    warmupText: "This warmup protocol is not random. It is specifically generated to prepare the muscle groups and movement patterns required for today's specific workout.",
                    swapTitle: "Valid Swaps",
                    swapText: "These exercises match the movement pattern (e.g., Push, Pull, Squat) and equipment requirements of the original exercise, ensuring the stimulus remains the same."
                }
            },
            history: {
                logbook: "Logbook",
                noLogs: "No workouts logged yet.",
                noSaved: "No saved workouts yet.",
                confirmClear: "Are you sure you want to delete all entries?",
                history: "History",
                saved: "Saved",
                start: "Start Workout"
            }
        }
    },
    de: {
        duration: "Dauer",
        movements: "Übungen",
        includeStrength: "Kraftteil (Teil A)",
        strengthSub: "Schwere Grundübung vor dem WOD",
        level: "Niveau",
        style: "Workout Stil",
        focus: "Fokus",
        injuries: "Verletzungen",
        gear: "Ausrüstung",
        generate: "Workout Generieren",
        rx: "Rx (Standard)",
        scaled: "Skaliert",
        beginner: "Anfänger",
        random: "Überraschung (Zufall)",
        chipper: "Chipper",
        tabata: "Tabata",
        ladder: "Leiter (Ladder)",
        deathBy: "Death By",
        partnerMode: "Partner Modus",
        partnerSub: "Doppeltes Volumen, gemeinsam teilen",
        focusTypes: { balanced: "Ausgeglichen", cardio: "Cardio", strength: "Kraft", gymnastics: "Gymnastik", core: "Core" },
        parts: { shoulders: "Schultern", knees: "Knie", back: "Rücken" },
        equip: { barbell: "Langhantel", dumbbell: "Kurzhantel / KB", pullup: "Klimmzugstange", machine: "Cardio Gerät" },
        audioSettings: {
            countdowns: "Countdowns (3-2-1)",
            announcements: "Ansagen (Nächste, Pause)",
            beeps: "Übergangs-Signaltöne"
        },
        tt: {
            injuries: "Smart-Filter: Entfernt belastende Übungen.",
            level: "Rx nutzt 100% Volumen. Skaliert reduziert die Wiederholungen auf 60% und vereinfacht komplexe Übungen.",
            focus: "Beeinflusst den Generator, bestimmte Bewegungsmuster zu bevorzugen (z.B. mehr Laufen/Burpees bei Cardio).",
            strength: "Smart Pairing: Wählt eine Übung, die das Metcon ergänzt (z.B. wenn das Metcon beinlastig ist, wird Oberkörper oder Hinge gewählt).",
            buyIn: "Eine einzelne Übung, die einmal zu Beginn des Workouts vor den Hauptrunden absolviert wird."
        },
        calculator: "1 Rep Max",
        weight: "Gewicht",
        reps: "Wiederholungen",
        calculate: "Berechnen",
        estimated1RM: "Geschätztes 1RM",
        percentages: "Prozentsätze",
        screens: {
            activeTimer: {
                greatJob: "Gut Gemacht",
                completeMsg: "Workout beendet. Ergebnis eintragen.",
                score: "Ergebnis / Notizen",
                save: "Speichern",
                cancel: "Abbrechen",
                rest: "PAUSE",
                workMode: "ARBEIT",
                rounds: "Runden",
                next: "Als nächstes:",
                confirmExit: "Workout abbrechen?",
                yesExit: "Ja, Abbrechen",
                noStay: "Nein, Weiter"
            },
            preview: {
                back: "Zurück",
                partA: "Teil A",
                partB: "Teil B",
                strength: "Kraft",
                conditioning: "Ausdauer",
                share: "Teilen",
                copied: "Kopiert",
                min: "Min",
                rounds: "Runden",
                warmup: "Aufwärm-Protokoll",
                start: "Timer Starten",
                save: "Speichern",
                saved: "Gespeichert",
                reroll: "Neu auswürfeln",
                rerollConfirm: "Nochmal tippen!",
                selectSwap: "Ersatz wählen",
                whySwap: "Passt zu Bewegungsmuster & Ausrüstung",
                explanations: {
                    strengthTitle: "Smarte Kraft-Paarung",
                    strengthText: "Wir analysieren die Bewegungsmuster in deinem Workout und wählen eine ergänzende Kraftübung. Wenn dein Metcon beinelastig ist (Kniebeugen), verschreiben wir vielleicht eine Druck- oder Zugübung, um die Balance zu halten.",
                    metconTitle: "Dynamisches Conditioning",
                    metconText: "Dieses Workout ist auf deine gewählte Dauer und Schwierigkeit skaliert. Wiederholungszahlen werden basierend auf dem Gesamtvolumen angepasst, um den beabsichtigten Reiz beizubehalten.",
                    warmupTitle: "Gezieltes Aufwärmen",
                    warmupText: "Dieses Aufwärmprogramm ist nicht zufällig. Es wurde speziell generiert, um die Muskelgruppen und Bewegungsmuster vorzubereiten, die für das heutige Workout benötigt werden.",
                    swapTitle: "Gültige Alternativen",
                    swapText: "Diese Übungen entsprechen dem Bewegungsmuster (z.B. Druck, Zug, Kniebeuge) und den Ausrüstungsanforderungen der ursprünglichen Übung, um sicherzustellen, dass der Reiz gleich bleibt."
                }
            },
            history: {
                logbook: "Logbuch",
                noLogs: "Noch keine Workouts gespeichert.",
                noSaved: "Noch keine gespeicherten Workouts.",
                confirmClear: "Möchten Sie wirklich alle Einträge löschen?",
                history: "Verlauf",
                saved: "Gespeichert",
                start: "Workout Starten"
            }
        }
    },
    strength: {
        names: {
            deadlift: { en: "Deadlift", de: "Kreuzheben" },
            backSquat: { en: "Back Squat", de: "Kniebeuge (hinten)" },
            frontSquat: { en: "Front Squat", de: "Frontkniebeuge" },
            pushPress: { en: "Push Press", de: "Push Press" },
            romanianDeadlift: { en: "Romanian Deadlift", de: "Rumänisches Kreuzheben" },
            strictPress: { en: "Strict Press", de: "Schulterdrücken" }
        },
        notes: {
            heavyForm: { en: "Heavy, Perfect Form", de: "Schwer, Fokus Technik" },
            building: { en: "Building weight", de: "Aufbauend" },
            uprightTorso: { en: "Focus on upright torso", de: "Fokus auf aufrechte Haltung" },
            explosiveHips: { en: "Explosive from the hips", de: "Explosiv aus der Hüfte" },
            controlledDescent: { en: "Controlled descent", de: "Kontrolliert abwärts" },
            tightCore: { en: "Tight core, no legs", de: "Rumpf fest, kein Beineinsatz" }
        }
    },
    warmup: {
        cardioEasy: { en: "3 min Cardio (Easy)", de: "3 min Cardio (Easy)" },
        airSquats: { en: "10 Air Squats", de: "10 Kniebeugen" },
        hingeWarmup: { en: "10 Glute Bridges + 10 Good Mornings", de: "10 Glute Bridges + 10 Good Mornings" },
        pushWarmup: { en: "10 Scap Push-ups + 5 Inchworms", de: "10 Scap Push-ups + 5 Inchworms" },
        pullWarmup: { en: "10 Ring Rows / Scap Pulls", de: "10 Ring Rows / Scap Pulls" },
        calfRaises: { en: "20 Calf Raises", de: "20 Wadenheben" }
    }
};
