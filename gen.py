import json
import random
import uuid

# Define rules for tenses
TENSES = ["simplePresent", "presentContinuous", "presentPerfect", "presentPerfectContinuous",
          "simplePast", "pastContinuous", "pastPerfect", "pastPerfectContinuous",
          "simpleFuture", "futureContinuous", "futurePerfect", "futurePerfectContinuous"]

DIFFICULTIES = ["easy", "medium", "hard"]
TYPES = ["mcq", "fill", "scramble", "match_pairs"]

VERBS = [
    {"v1": "eat", "v2": "ate", "v3": "eaten", "v4": "eating", "s": "eats", "urdu": "کھاتا"},
    {"v1": "play", "v2": "played", "v3": "played", "v4": "playing", "s": "plays", "urdu": "کھیلتا"},
    {"v1": "go", "v2": "went", "v3": "gone", "v4": "going", "s": "goes", "urdu": "جاتا"},
    {"v1": "write", "v2": "wrote", "v3": "written", "v4": "writing", "s": "writes", "urdu": "لکھتا"},
    {"v1": "read", "v2": "read", "v3": "read", "v4": "reading", "s": "reads", "urdu": "پڑھتا"},
    {"v1": "sleep", "v2": "slept", "v3": "slept", "v4": "sleeping", "s": "sleeps", "urdu": "سوتا"},
]

SUBJS_EN = {"I": "میں", "We": "ہم", "You": "تم", "He": "وہ", "She": "وہ", "They": "وہ"}
SUBJ_TYPES = {"I": "1s", "We": "1p", "You": "2", "He": "3sm", "She": "3sf", "They": "3p"}

# Very basic template generator to fulfill "up to 10 questions per tense"
# Since generating linguistically accurate sentences for all 12 tenses x 6 pronouns is complex,
# we will construct a set of static high-quality arrays for the user instead to guarantee
# accurate Urdu translations which cannot be easily templated without getting genders wrong in Urdu.

print("It's highly recommended to use LLM to output a static JSON block instead of dynamic code because Urdu gender/plurality conjugations are incredibly complex.")
