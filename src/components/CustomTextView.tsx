import React, { useState } from 'react';

interface CustomTextViewProps {
  onStartCustomTest: (customPassage: string) => void;
  onCancel: () => void;
}

export const CustomTextView: React.FC<CustomTextViewProps> = ({
  onStartCustomTest,
  onCancel,
}) => {
  const [text, setText] = useState<string>('');

  const sampleTexts = [
    {
      title: 'architecture',
      text: 'Good architecture makes the system easy to understand, easy to develop, easy to maintain, and easy to deploy. The ultimate goal of system architecture is to minimize the lifetime cost of the system and to maximize programmer productivity.',
    },
    {
      title: 'typescript',
      text: 'TypeScript provides compile-time type verification while compiling down to idiomatic, predictable JavaScript. Static typing detects discrepancies before execution, enhancing code quality and velocity across complex distributed architectures.',
    },
    {
      title: 'mechanical feel',
      text: 'Mechanical keyboards utilize physical switches beneath every keycap. Linear switches offer uninterrupted travel, while tactile switches provide a distinct bump at actuation, offering immediate sensory feedback that minimizes bottoming out.',
    },
  ];

  const handleStart = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onStartCustomTest(trimmed);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 select-none font-mono animate-fadeIn">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#D8D6D1] dark:border-[#242424]">
        <h1 className="text-xl font-bold text-[#111111] dark:text-[#F5F5F5]">
          custom text
        </h1>
        <button
          onClick={onCancel}
          className="text-xs text-[#FF5A00] hover:underline cursor-pointer"
        >
          return to test
        </button>
      </div>

      {/* Textarea */}
      <div className="space-y-4 mb-8">
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="paste or type your custom text here..."
          className="w-full p-4 rounded bg-transparent border border-[#D8D6D1] dark:border-[#242424] focus:border-[#FF5A00] text-[#111111] dark:text-[#F5F5F5] text-sm font-mono leading-relaxed outline-none resize-none transition-colors placeholder:text-[#646669]"
        />

        <div className="flex items-center justify-between text-xs text-[#646669] dark:text-[#646669]">
          <span>{text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0} words · {text.length} characters</span>
        </div>

        {/* Presets */}
        <div className="pt-2">
          <span className="text-xs text-[#646669] dark:text-[#646669] block mb-2">or select an excerpt:</span>
          <div className="flex flex-wrap gap-2">
            {sampleTexts.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => setText(sample.text)}
                className="px-3 py-1.5 rounded border border-[#D8D6D1] dark:border-[#242424] hover:border-[#FF5A00] text-xs text-[#646669] hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="flex items-center justify-end gap-4">
        <button
          onClick={handleStart}
          disabled={!text.trim()}
          className="px-6 py-2 rounded bg-[#FF5A00] disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold text-xs uppercase tracking-wider hover:bg-[#FF6E1A] transition-all cursor-pointer"
        >
          start custom test
        </button>
      </div>

    </div>
  );
};
