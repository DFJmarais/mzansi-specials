import React, { useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Button } from '@/components/ui/button';
import { Settings, X, Moon, Sun, Type, Contrast, Volume2, Keyboard } from 'lucide-react';

export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    settings,
    toggleDarkMode,
    increaseFontSize,
    decreaseFontSize,
    toggleHighContrast,
    toggleTextToSpeech,
    toggleKeyboardNavigation,
    speak,
  } = useAccessibility();

  const fontSizeLabels = {
    'small': 'A-',
    'normal': 'A',
    'large': 'A+',
    'extra-large': 'A++',
  };

  return (
    <div className="relative">
      {/* Accessibility Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="border-2 border-primary/30 hover:bg-primary/10"
        title="Accessibility Settings"
        aria-label="Open accessibility settings"
      >
        <Settings className="w-5 h-5" />
      </Button>

      {/* Accessibility Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 bg-white dark:bg-slate-900 border-2 border-primary/30 rounded-lg shadow-lg p-4 w-80 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground">Accessibility Settings</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close accessibility settings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                {settings.darkMode ? (
                  <Moon className="w-5 h-5 text-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-primary" />
                )}
                <label className="text-sm font-medium cursor-pointer">Dark Mode</label>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.darkMode ? 'bg-primary' : 'bg-gray-300'
                }`}
                aria-label={`Toggle dark mode: ${settings.darkMode ? 'on' : 'off'}`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.darkMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Font Size Control */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Type className="w-5 h-5 text-primary" />
                <label className="text-sm font-medium">Font Size</label>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decreaseFontSize}
                  disabled={settings.fontSize === 'small'}
                  className="text-xs"
                  aria-label="Decrease font size"
                >
                  A-
                </Button>
                <span className="text-sm font-semibold min-w-[2rem] text-center">
                  {fontSizeLabels[settings.fontSize]}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={increaseFontSize}
                  disabled={settings.fontSize === 'extra-large'}
                  className="text-xs"
                  aria-label="Increase font size"
                >
                  A+
                </Button>
              </div>
            </div>

            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Contrast className="w-5 h-5 text-primary" />
                <label className="text-sm font-medium cursor-pointer">High Contrast</label>
              </div>
              <button
                onClick={toggleHighContrast}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.highContrast ? 'bg-primary' : 'bg-gray-300'
                }`}
                aria-label={`Toggle high contrast: ${settings.highContrast ? 'on' : 'off'}`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.highContrast ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Text-to-Speech Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-primary" />
                <label className="text-sm font-medium cursor-pointer">Text-to-Speech</label>
              </div>
              <button
                onClick={toggleTextToSpeech}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.textToSpeech ? 'bg-primary' : 'bg-gray-300'
                }`}
                aria-label={`Toggle text-to-speech: ${settings.textToSpeech ? 'on' : 'off'}`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.textToSpeech ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Keyboard Navigation Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-primary" />
                <label className="text-sm font-medium cursor-pointer">Keyboard Nav</label>
              </div>
              <button
                onClick={toggleKeyboardNavigation}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.keyboardNavigation ? 'bg-primary' : 'bg-gray-300'
                }`}
                aria-label={`Toggle keyboard navigation: ${settings.keyboardNavigation ? 'on' : 'off'}`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.keyboardNavigation ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Test Text-to-Speech */}
            {settings.textToSpeech && (
              <Button
                variant="secondary"
                className="w-full text-sm"
                onClick={() => speak('Accessibility settings enabled. You can now use text-to-speech to hear product descriptions and other content.')}
              >
                Test Text-to-Speech
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-4 text-center">
            Your settings are saved automatically
          </p>
        </div>
      )}
    </div>
  );
}
