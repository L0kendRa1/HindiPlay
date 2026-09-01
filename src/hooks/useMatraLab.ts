import { useState, useCallback, useMemo } from 'react';
import { HindiCharacter } from '../types/activity';
import { HindiUnit } from '../types/wordBuilder';
import { MatraDefinition, HINDI_MATRAS, STARTER_MATRA_CONSONANTS } from '../data/matras';
import { combineCharacterWithMatra } from '../services/hindiUnitComposer';
import { audioService } from '../services/audioService';

export interface UseMatraLabOptions {
  initialConsonant?: HindiCharacter;
  initialMatra?: MatraDefinition | null;
}

export function useMatraLab(options: UseMatraLabOptions = {}) {
  const consonants = STARTER_MATRA_CONSONANTS;
  const matras = HINDI_MATRAS;

  const [selectedConsonant, setSelectedConsonant] = useState<HindiCharacter>(
    options.initialConsonant || consonants[0]
  );
  const [selectedMatra, setSelectedMatra] = useState<MatraDefinition | null>(
    options.initialMatra !== undefined ? options.initialMatra : matras[0] // defaults to 'ा' (आ की मात्रा) for immediate instant delight
  );
  const [exploredSet, setExploredSet] = useState<Set<string>>(() => {
    const initialUnit = combineCharacterWithMatra(
      (options.initialConsonant || consonants[0]).char,
      options.initialMatra !== undefined ? options.initialMatra : matras[0]
    );
    return new Set<string>([initialUnit.display]);
  });
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // Compute current combined HindiUnit
  const currentUnit: HindiUnit = useMemo(() => {
    return combineCharacterWithMatra(selectedConsonant.char, selectedMatra);
  }, [selectedConsonant, selectedMatra]);

  // Select a consonant (retains current matra for comparative pattern learning: म+ा=मा -> क+ा=का)
  const selectConsonant = useCallback((char: HindiCharacter) => {
    setSelectedConsonant(char);
    audioService.playSfx('pop');
    setExploredSet((prev) => {
      const nextUnit = combineCharacterWithMatra(char.char, selectedMatra);
      const next = new Set(prev);
      next.add(nextUnit.display);
      return next;
    });
  }, [selectedMatra]);

  // Select a matra
  const selectMatra = useCallback((matra: MatraDefinition | null) => {
    setSelectedMatra(matra);
    audioService.playSfx('pop');
    setExploredSet((prev) => {
      const nextUnit = combineCharacterWithMatra(selectedConsonant.char, matra);
      const next = new Set(prev);
      next.add(nextUnit.display);
      return next;
    });
  }, [selectedConsonant]);

  // Play audio of the current combined unit
  const playCurrentAudio = useCallback(() => {
    if (!currentUnit.display) return;
    setIsAudioPlaying(true);
    audioService.playSpeechText(
      currentUnit.display,
      () => setIsAudioPlaying(true),
      () => setIsAudioPlaying(false),
      0.88
    );
  }, [currentUnit]);

  // Reset to default starting state
  const resetLab = useCallback(() => {
    audioService.stopSpeech();
    audioService.playSfx('click');
    setSelectedConsonant(consonants[0]);
    setSelectedMatra(matras[0]);
    const resetUnit = combineCharacterWithMatra(consonants[0].char, matras[0]);
    setExploredSet(new Set([resetUnit.display]));
    setIsAudioPlaying(false);
  }, [consonants, matras]);

  return {
    consonants,
    matras,
    selectedConsonant,
    selectedMatra,
    currentUnit,
    exploredCount: exploredSet.size,
    isAudioPlaying,
    selectConsonant,
    selectMatra,
    playCurrentAudio,
    resetLab,
  };
}
