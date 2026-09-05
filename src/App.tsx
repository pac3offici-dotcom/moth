// App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './logo.png';

// Import DM Sans font
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

// Complete model library from main.py
const MODEL_LIBRARY = [
  { name: 'Qwen2.5 0.5B Instruct', description: 'Tiny and very fast. Great for confirming your setup works before going bigger.', filename: 'qwen2.5-0.5b-instruct-q4_k_m.gguf', url: 'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf?download=true', approx_size_mb: 400, quantization: 'Q4_K_M', reasoning: false, performance: 2, enterprise_only: false },
  { name: 'SmolLM2 360M Instruct', description: 'Extremely tiny — runs on almost anything, but very limited in capability.', filename: 'smollm2-360m-instruct-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/SmolLM2-360M-Instruct-GGUF/resolve/main/SmolLM2-360M-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 280, quantization: 'Q4_K_M', reasoning: false, performance: 1, enterprise_only: false },
  { name: 'TinyLlama 1.1B Chat', description: 'Popular tiny model — surprisingly capable for its size.', filename: 'tinyllama-1.1b-chat-v1.0-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/TinyLlama-1.1B-Chat-v1.0-Q4_K_M.gguf?download=true', approx_size_mb: 700, quantization: 'Q4_K_M', reasoning: false, performance: 2, enterprise_only: false },
  { name: 'Phi-2 2.7B', description: "Microsoft's compact model — strong reasoning for its size.", filename: 'phi-2-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Phi-2-GGUF/resolve/main/Phi-2-Q4_K_M.gguf?download=true', approx_size_mb: 1700, quantization: 'Q4_K_M', reasoning: false, performance: 3, enterprise_only: false },
  { name: 'Phi-3 Mini 3.8B Instruct', description: "Microsoft's latest small model — excellent reasoning for 3.8B parameters.", filename: 'phi-3-mini-3.8b-instruct-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Phi-3-mini-3.8B-Instruct-GGUF/resolve/main/Phi-3-mini-3.8B-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 2400, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Qwen2.5 1.5B Instruct', description: 'Noticeably smarter than the 0.5B model while still running on modest hardware.', filename: 'qwen2.5-1.5b-instruct-q4_k_m.gguf', url: 'https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q4_k_m.gguf?download=true', approx_size_mb: 1100, quantization: 'Q4_K_M', reasoning: false, performance: 3, enterprise_only: false },
  { name: 'SmolLM2 1.7B Instruct', description: 'A tiny but capable model from Hugging Face — great for low-resource setups.', filename: 'smollm2-1.7b-instruct-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/SmolLM2-1.7B-Instruct-GGUF/resolve/main/SmolLM2-1.7B-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 1200, quantization: 'Q4_K_M', reasoning: false, performance: 2, enterprise_only: false },
  { name: 'StableLM 2 Zephyr 1.6B', description: 'Compact Stability AI chat model; useful for lightweight local inference.', filename: 'stablelm-2-zephyr-1_6b.q4_k_m.gguf', url: 'https://huggingface.co/afrideva/stablelm-2-zephyr-1_6b-GGUF/resolve/main/stablelm-2-zephyr-1_6b.q4_k_m.gguf?download=true', approx_size_mb: 1080, quantization: 'Q4_K_M', reasoning: false, performance: 2, enterprise_only: false },
  { name: 'Granite 3 2B Instruct', description: 'Small enterprise model — fast and efficient for basic tasks.', filename: 'granite-3-2b-instruct-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Granite-3-2B-Instruct-GGUF/resolve/main/Granite-3-2B-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 1400, quantization: 'Q4_K_M', reasoning: false, performance: 3, enterprise_only: false },
  { name: 'StableLM Zephyr 3B', description: 'Small instruction-following model from the StableLM/Zephyr family.', filename: 'stablelm-zephyr-3b.Q4_K_M.gguf', url: 'https://huggingface.co/TheBloke/stablelm-zephyr-3b-GGUF/resolve/main/stablelm-zephyr-3b.Q4_K_M.gguf?download=true', approx_size_mb: 1710, quantization: 'Q4_K_M', reasoning: false, performance: 3, enterprise_only: false },
  { name: 'Qwen2.5 3B Instruct', description: 'A solid general-purpose chat model if you have some RAM to spare.', filename: 'qwen2.5-3b-instruct-q4_k_m.gguf', url: 'https://huggingface.co/Qwen/Qwen2.5-3B-Instruct-GGUF/resolve/main/qwen2.5-3b-instruct-q4_k_m.gguf?download=true', approx_size_mb: 2000, quantization: 'Q4_K_M', reasoning: false, performance: 3, enterprise_only: false },
  { name: 'Llama 3.2 3B Instruct', description: "Meta's small Llama 3.2 model — a good, well-rounded default for chat.", filename: 'llama-3.2-3b-instruct-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 2000, quantization: 'Q4_K_M', reasoning: false, performance: 3, enterprise_only: false },
  { name: 'StarCoder2 3B', description: 'Small code generation and completion model from the StarCoder2 family.', filename: 'StarCoder2-3B-Q4_K_M.gguf', url: 'https://huggingface.co/second-state/StarCoder2-3B-GGUF/resolve/main/StarCoder2-3B-Q4_K_M.gguf?download=true', approx_size_mb: 1900, quantization: 'Q4_K_M', reasoning: false, performance: 3, enterprise_only: false },
  { name: 'Phi-3.5 Mini Instruct', description: "Microsoft's compact model, punches above its weight on reasoning tasks.", filename: 'phi-3.5-mini-instruct-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Phi-3.5-mini-instruct-GGUF/resolve/main/Phi-3.5-mini-instruct-Q4_K_M.gguf?download=true', approx_size_mb: 2400, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Phi-3 Medium 14B Instruct', description: "Microsoft's larger Phi model — strong performance for its size.", filename: 'phi-3-medium-14b-instruct-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Phi-3-medium-14B-Instruct-GGUF/resolve/main/Phi-3-medium-14B-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 8800, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Mistral 7B Instruct v0.1', description: 'Original Mistral 7B — solid baseline for chat and reasoning.', filename: 'mistral-7b-instruct-v0.1-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Mistral-7B-Instruct-v0.1-GGUF/resolve/main/Mistral-7B-Instruct-v0.1-Q4_K_M.gguf?download=true', approx_size_mb: 4400, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Mistral 7B Instruct v0.2', description: 'Improved Mistral 7B with better instruction following.', filename: 'mistral-7b-instruct-v0.2-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Mistral-7B-Instruct-v0.2-GGUF/resolve/main/Mistral-7B-Instruct-v0.2-Q4_K_M.gguf?download=true', approx_size_mb: 4400, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Mistral 7B Instruct v0.3', description: 'Latest Mistral 7B — best-in-class for its size.', filename: 'mistral-7b-instruct-v0.3-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Mistral-7B-Instruct-v0.3-GGUF/resolve/main/Mistral-7B-Instruct-v0.3-Q4_K_M.gguf?download=true', approx_size_mb: 4400, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Qwen2.5 7B Instruct', description: 'A strong 7B model with excellent reasoning and chat capabilities.', filename: 'qwen2.5-7b-instruct-q4_k_m.gguf', url: 'https://huggingface.co/Qwen/Qwen2.5-7B-Instruct-GGUF/resolve/main/qwen2.5-7b-instruct-q4_k_m.gguf?download=true', approx_size_mb: 4500, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Qwen2.5 Coder 7B Instruct', description: 'Modern Qwen coding model with strong code generation, debugging, and instruction following.', filename: 'Qwen2.5-Coder-7B-Instruct-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/Qwen2.5-Coder-7B-Instruct-GGUF/resolve/main/Qwen2.5-Coder-7B-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 4680, quantization: 'Q4_K_M', reasoning: false, performance: 5, enterprise_only: false },
  { name: 'OpenChat 3.5 7B', description: 'Strong open-source chat model — often outperforms larger models on benchmarks.', filename: 'openchat-3.5-7b-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/OpenChat-3.5-7B-GGUF/resolve/main/OpenChat-3.5-7B-Q4_K_M.gguf?download=true', approx_size_mb: 4400, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'OpenChat 3.6 8B', description: 'Newer OpenChat model — improved reasoning and instruction following.', filename: 'openchat-3.6-8b-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/OpenChat-3.6-8B-GGUF/resolve/main/OpenChat-3.6-8B-Q4_K_M.gguf?download=true', approx_size_mb: 4800, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Zephyr 7B Beta', description: 'Hugging Face Zephyr instruction-tuned 7B model with a mature GGUF release.', filename: 'zephyr-7B-beta.Q4_K_M.gguf', url: 'https://huggingface.co/TheBloke/zephyr-7B-beta-GGUF/resolve/main/zephyr-7B-beta.Q4_K_M.gguf?download=true', approx_size_mb: 1970, quantization: 'Q4_K_M', reasoning: false, performance: 3, enterprise_only: false },
  { name: 'Neural Chat 7B', description: "Intel's fine-tuned chat model — optimized for instruction following.", filename: 'neural-chat-7b-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Neural-Chat-7B-GGUF/resolve/main/Neural-Chat-7B-Q4_K_M.gguf?download=true', approx_size_mb: 4400, quantization: 'Q4_K_M', reasoning: false, performance: 3, enterprise_only: false },
  { name: 'Dolphin 2.2.1 Mistral 7B', description: 'Fine-tuned Mistral with improved instruction following and creativity.', filename: 'dolphin-2.2.1-mistral-7b-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Dolphin-2.2.1-Mistral-7B-GGUF/resolve/main/Dolphin-2.2.1-Mistral-7B-Q4_K_M.gguf?download=true', approx_size_mb: 4400, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'DeepSeek-Coder 6.7B', description: 'Specialized coding model from DeepSeek — strong at code generation and debugging.', filename: 'deepseek-coder-6.7b-instruct-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/DeepSeek-Coder-6.7B-Instruct-GGUF/resolve/main/DeepSeek-Coder-6.7B-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 4200, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'CodeLlama 7B Instruct', description: 'Smaller coding model — fast and good for basic programming tasks.', filename: 'codellama-7b-instruct-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/CodeLlama-7B-Instruct-GGUF/resolve/main/CodeLlama-7B-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 4400, quantization: 'Q4_K_M', reasoning: false, performance: 3, enterprise_only: false },
  { name: 'StarCoder2 7B', description: 'Medium coding model — strong code generation and completion.', filename: 'starcoder2-7b-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/StarCoder2-7B-GGUF/resolve/main/StarCoder2-7B-Q4_K_M.gguf?download=true', approx_size_mb: 4400, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Qwen2.5 Math 7B Instruct', description: 'Math-specialized Qwen model for structured problem solving.', filename: 'Qwen2.5-Math-7B-Instruct-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/Qwen2.5-Math-7B-Instruct-GGUF/resolve/main/Qwen2.5-Math-7B-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 4680, quantization: 'Q4_K_M', reasoning: true, performance: 4, enterprise_only: false },
  { name: 'CollectiveLM Falcon 3 7B', description: 'Instruction-tuned Falcon 3 derivative with a verified current GGUF repository.', filename: 'CollectiveLM-Falcon-3-7B-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/CollectiveLM-Falcon-3-7B-GGUF/resolve/main/CollectiveLM-Falcon-3-7B-Q4_K_M.gguf?download=true', approx_size_mb: 4570, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Olmo 2 7B', description: "AI2's Olmo 2 model — strong on reasoning and scientific tasks.", filename: 'olmo-2-7b-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Olmo-2-7B-GGUF/resolve/main/Olmo-2-7B-Q4_K_M.gguf?download=true', approx_size_mb: 4400, quantization: 'Q4_K_M', reasoning: false, performance: 3, enterprise_only: false },
  { name: 'Granite 3 8B Instruct', description: "IBM's enterprise-focused 8B model — strong on code and reasoning.", filename: 'granite-3-8b-instruct-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Granite-3-8B-Instruct-GGUF/resolve/main/Granite-3-8B-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 4800, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Tulu 3 8B', description: 'Smaller Tulu model — excellent for its size, great for instruction tasks.', filename: 'tulu-3-8b-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Tulu-3-8B-GGUF/resolve/main/Tulu-3-8B-Q4_K_M.gguf?download=true', approx_size_mb: 4800, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Llama 3 8B Instruct', description: "Meta's Llama 3 8B — strong performance and efficient.", filename: 'llama-3-8b-instruct-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Meta-Llama-3-8B-Instruct-GGUF/resolve/main/Meta-Llama-3-8B-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 4800, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Llama 3.1 8B Instruct', description: "Meta's latest 8B model, highly capable and efficient.", filename: 'llama-3.1-8b-instruct-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Meta-Llama-3.1-8B-Instruct-GGUF/resolve/main/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 4800, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'SOLAR 10.7B Instruct', description: "Upstage's merged 10.7B model — strong reasoning and context handling.", filename: 'solar-10.7b-instruct-v1.0-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/SOLAR-10.7B-Instruct-v1.0-GGUF/resolve/main/SOLAR-10.7B-Instruct-v1.0-Q4_K_M.gguf?download=true', approx_size_mb: 6800, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Yi 1.5 9B Chat', description: "01.AI's 9B chat model — strong instruction following, fully open.", filename: 'yi-1.5-9b-chat-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Yi-1.5-9B-Chat-GGUF/resolve/main/Yi-1.5-9B-Chat-Q4_K_M.gguf?download=true', approx_size_mb: 5500, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Yi 1.5 9B Chat (Q6_K)', description: 'Higher quality version of Yi 1.5 9B Chat — slower but more accurate.', filename: 'yi-1.5-9b-chat-q6_k.gguf', url: 'https://huggingface.co/bartowski/Yi-1.5-9B-Chat-GGUF/resolve/main/Yi-1.5-9B-Chat-Q6_K.gguf?download=true', approx_size_mb: 8200, quantization: 'Q6_K', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Qwen2.5 14B Instruct', description: 'A larger Qwen model that delivers near state-of-the-art performance.', filename: 'qwen2.5-14b-instruct-q4_k_m.gguf', url: 'https://huggingface.co/Qwen/Qwen2.5-14B-Instruct-GGUF/resolve/main/qwen2.5-14b-instruct-q4_k_m.gguf?download=true', approx_size_mb: 8800, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'DeepSeek-Coder-V2 Lite Instruct', description: "DeepSeek's efficient 16B MoE coding model — strong reasoning in a compact package.", filename: 'deepseek-coder-v2-lite-instruct-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/DeepSeek-Coder-V2-Lite-Instruct-GGUF/resolve/main/DeepSeek-Coder-V2-Lite-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 10500, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Falcon 2 11B', description: "TII's latest Falcon model — strong performance in a compact 11B package.", filename: 'falcon-2-11b-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Falcon-2-11B-GGUF/resolve/main/Falcon-2-11B-Q4_K_M.gguf?download=true', approx_size_mb: 6800, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Olmo 2 13B', description: 'Larger Olmo model — improved reasoning and scientific accuracy.', filename: 'olmo-2-13b-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Olmo-2-13B-GGUF/resolve/main/Olmo-2-13B-Q4_K_M.gguf?download=true', approx_size_mb: 8200, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'StarCoder2 15B', description: 'Large coding model — excellent for complex programming tasks. Needs 12GB+ RAM.', filename: 'starcoder2-15b-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/StarCoder2-15B-GGUF/resolve/main/StarCoder2-15B-Q4_K_M.gguf?download=true', approx_size_mb: 9200, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Qwen2.5 32B Instruct', description: 'A massive 32B model with excellent reasoning and creativity. Needs 24GB+ RAM.', filename: 'qwen2.5-32b-instruct-q4_k_m.gguf', url: 'https://huggingface.co/Qwen/Qwen2.5-32B-Instruct-GGUF/resolve/main/qwen2.5-32b-instruct-q4_k_m.gguf?download=true', approx_size_mb: 20000, quantization: 'Q4_K_M', reasoning: false, performance: 5, enterprise_only: false },
  { name: 'Qwen2.5 32B Instruct (Q6_K)', description: 'Higher quality Qwen 32B — needs 32GB+ RAM but delivers better results.', filename: 'qwen2.5-32b-instruct-q6_k.gguf', url: 'https://huggingface.co/Qwen/Qwen2.5-32B-Instruct-GGUF/resolve/main/qwen2.5-32b-instruct-q6_k.gguf?download=true', approx_size_mb: 30000, quantization: 'Q6_K', reasoning: false, performance: 5, enterprise_only: false },
  { name: 'Command-R 35B', description: "Cohere's efficient 35B model — strong RAG capabilities and long context.", filename: 'command-r-35b-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Command-R-35B-GGUF/resolve/main/Command-R-35B-Q4_K_M.gguf?download=true', approx_size_mb: 22000, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Command-R 03-2024 35B', description: 'Latest Command-R release — improved reasoning and tool use.', filename: 'command-r-03-2024-35b-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Command-R-03-2024-35B-GGUF/resolve/main/Command-R-03-2024-35B-Q4_K_M.gguf?download=true', approx_size_mb: 22000, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'CodeLlama 34B Instruct', description: "Meta's large coding model — excellent for complex programming tasks.", filename: 'codellama-34b-instruct-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/CodeLlama-34B-Instruct-GGUF/resolve/main/CodeLlama-34B-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 20000, quantization: 'Q4_K_M', reasoning: false, performance: 5, enterprise_only: false },
  { name: 'DeepSeek-Coder 33B', description: 'Massive coding model — top-tier code generation. Needs 24GB+ RAM.', filename: 'deepseek-coder-33b-instruct-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/DeepSeek-Coder-33B-Instruct-GGUF/resolve/main/DeepSeek-Coder-33B-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 20000, quantization: 'Q4_K_M', reasoning: false, performance: 5, enterprise_only: false },
  { name: 'Qwen3 30B-A3B Instruct', description: 'Mixture-of-experts Qwen3 model with 30B total parameters and 3B active parameters.', filename: 'Qwen3-30B-A3B-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/Qwen_Qwen3-30B-A3B-GGUF/resolve/main/Qwen3-30B-A3B-Q4_K_M.gguf?download=true', approx_size_mb: 19000, quantization: 'Q4_K_M', reasoning: true, performance: 5, enterprise_only: true, enterprise_warning: '~19GB model file; high-RAM systems or GPU offload recommended.' },
  { name: 'Llama 3 70B Instruct', description: "Meta's Llama 3 70B — flagship model, needs 48GB+ RAM.", filename: 'llama-3-70b-instruct-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Llama-3-70B-Instruct-GGUF/resolve/main/Llama-3-70B-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 42000, quantization: 'Q4_K_M', reasoning: false, performance: 5, enterprise_only: false },
  { name: 'Llama 3.1 70B Instruct', description: "Meta's flagship 70B model - extremely capable, needs 48GB+ RAM.", filename: 'llama-3.1-70b-instruct-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Llama-3.1-70B-Instruct-GGUF/resolve/main/Llama-3.1-70B-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 42000, quantization: 'Q4_K_M', reasoning: false, performance: 5, enterprise_only: false },
  { name: 'Llama 3.3 70B Instruct', description: "Meta's newest 70B — improved reasoning and tool use.", filename: 'llama-3.3-70b-instruct-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Llama-3.3-70B-Instruct-GGUF/resolve/main/Llama-3.3-70B-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 42000, quantization: 'Q4_K_M', reasoning: false, performance: 5, enterprise_only: false },
  { name: 'Qwen2.5 72B Instruct', description: "Qwen's flagship 72B model — state-of-the-art reasoning. Needs 48GB+ RAM.", filename: 'qwen2.5-72b-instruct-q4_k_m.gguf', url: 'https://huggingface.co/Qwen/Qwen2.5-72B-Instruct-GGUF/resolve/main/qwen2.5-72b-instruct-q4_k_m.gguf?download=true', approx_size_mb: 44000, quantization: 'Q4_K_M', reasoning: false, performance: 5, enterprise_only: false },
  { name: 'Qwen2.5 72B Instruct (Q6_K)', description: 'Higher quality Qwen 72B — needs 64GB+ RAM. Top-tier performance.', filename: 'qwen2.5-72b-instruct-q6_k.gguf', url: 'https://huggingface.co/Qwen/Qwen2.5-72B-Instruct-GGUF/resolve/main/qwen2.5-72b-instruct-q6_k.gguf?download=true', approx_size_mb: 66000, quantization: 'Q6_K', reasoning: false, performance: 5, enterprise_only: false },
  { name: 'Llama 3.1 Tulu 3 70B', description: "AllenAI's Tulu 3 instruction model built on Llama 3.1 70B.", filename: 'Llama-3.1-Tulu-3-70B-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/Llama-3.1-Tulu-3-70B-GGUF/resolve/main/Llama-3.1-Tulu-3-70B-Q4_K_M.gguf?download=true', approx_size_mb: 42520, quantization: 'Q4_K_M', reasoning: false, performance: 5, enterprise_only: true, enterprise_warning: '~42GB model file; workstation-class memory/GPU resources recommended.' },
  { name: 'Mixtral 8x7B Instruct v0.1', description: "Mistral's MoE model — 8 experts x 7B, efficient and powerful. Needs 16GB+ RAM.", filename: 'mixtral-8x7b-instruct-v0.1-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Mixtral-8x7B-Instruct-v0.1-GGUF/resolve/main/Mixtral-8x7B-Instruct-v0.1-Q4_K_M.gguf?download=true', approx_size_mb: 12000, quantization: 'Q4_K_M', reasoning: false, performance: 5, enterprise_only: false },
  { name: 'Mixtral 8x7B Instruct v0.1 (Q6_K)', description: 'Higher quality Mixtral — better reasoning, needs 20GB+ RAM.', filename: 'mixtral-8x7b-instruct-v0.1-q6_k.gguf', url: 'https://huggingface.co/bartowski/Mixtral-8x7B-Instruct-v0.1-GGUF/resolve/main/Mixtral-8x7B-Instruct-v0.1-Q6_K.gguf?download=true', approx_size_mb: 18000, quantization: 'Q6_K', reasoning: false, performance: 5, enterprise_only: false },
  { name: 'Mixtral 8x22B Instruct', description: 'Massive MoE model — 8 experts x 22B. Needs 32GB+ RAM. Top-tier performance.', filename: 'mixtral-8x22b-instruct-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/Mixtral-8x22B-Instruct-GGUF/resolve/main/Mixtral-8x22B-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 20000, quantization: 'Q4_K_M', reasoning: false, performance: 5, enterprise_only: false },
  { name: 'Mixtral 8x22B Instruct (Q6_K)', description: 'Highest quality Mixtral — needs 48GB+ RAM. Exceptional performance.', filename: 'mixtral-8x22b-instruct-q6_k.gguf', url: 'https://huggingface.co/bartowski/Mixtral-8x22B-Instruct-GGUF/resolve/main/Mixtral-8x22B-Instruct-Q6_K.gguf?download=true', approx_size_mb: 30000, quantization: 'Q6_K', reasoning: false, performance: 5, enterprise_only: false },
  { name: 'DeepSeek-R1 Distill Qwen 1.5B', description: 'Small reasoning model — shows its chain of thought before answering.', filename: 'deepseek-r1-distill-qwen-1.5b-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/DeepSeek-R1-Distill-Qwen-1.5B-GGUF/resolve/main/DeepSeek-R1-Distill-Qwen-1.5B-Q4_K_M.gguf?download=true', approx_size_mb: 1100, quantization: 'Q4_K_M', reasoning: true, performance: 3, enterprise_only: false },
  { name: 'DeepSeek-R1 Distill Qwen 7B', description: 'Bigger reasoning model with noticeably stronger step-by-step problem solving.', filename: 'deepseek-r1-distill-qwen-7b-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/DeepSeek-R1-Distill-Qwen-7B-GGUF/resolve/main/DeepSeek-R1-Distill-Qwen-7B-Q4_K_M.gguf?download=true', approx_size_mb: 4700, quantization: 'Q4_K_M', reasoning: true, performance: 4, enterprise_only: false },
  { name: 'DeepSeek-R1 Distill Llama 8B', description: 'Llama-based reasoning model — strong chain-of-thought for complex tasks.', filename: 'deepseek-r1-distill-llama-8b-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/DeepSeek-R1-Distill-Llama-8B-GGUF/resolve/main/DeepSeek-R1-Distill-Llama-8B-Q4_K_M.gguf?download=true', approx_size_mb: 4800, quantization: 'Q4_K_M', reasoning: true, performance: 4, enterprise_only: false },
  { name: 'DeepSeek-R1 Distill Qwen 14B', description: 'Even larger reasoning model — excellent for complex problem solving.', filename: 'deepseek-r1-distill-qwen-14b-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/DeepSeek-R1-Distill-Qwen-14B-GGUF/resolve/main/DeepSeek-R1-Distill-Qwen-14B-Q4_K_M.gguf?download=true', approx_size_mb: 8800, quantization: 'Q4_K_M', reasoning: true, performance: 4, enterprise_only: false },
  { name: 'DeepSeek-R1 Distill Qwen 32B', description: 'Large reasoning model — state-of-the-art chain-of-thought. Needs 24GB+ RAM.', filename: 'deepseek-r1-distill-qwen-32b-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/DeepSeek-R1-Distill-Qwen-32B-GGUF/resolve/main/DeepSeek-R1-Distill-Qwen-32B-Q4_K_M.gguf?download=true', approx_size_mb: 20000, quantization: 'Q4_K_M', reasoning: true, performance: 5, enterprise_only: false },
  { name: 'QwQ 32B', description: "Qwen's reasoning-focused 32B model with a current GGUF release.", filename: 'Qwen_QwQ-32B-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/Qwen_QwQ-32B-GGUF/resolve/main/Qwen_QwQ-32B-Q4_K_M.gguf?download=true', approx_size_mb: 19850, quantization: 'Q4_K_M', reasoning: true, performance: 5, enterprise_only: false },
  { name: 'DeepSeek-V3 671B (Q2_K)', description: '⚠️ ENTERPRISE-ONLY: Massive MoE reasoning model — needs 64GB+ RAM and 2+ GPUs.', filename: 'deepseek-v3-0324-q2_k.gguf', url: 'https://huggingface.co/bartowski/deepseek-ai_DeepSeek-V3-0324-GGUF/resolve/main/deepseek-ai_DeepSeek-V3-0324-Q2_K.gguf?download=true', approx_size_mb: 249000, quantization: 'Q2_K', reasoning: true, performance: 5, enterprise_only: true, enterprise_warning: '⚠️ ENTERPRISE-ONLY: 64GB+ RAM, 2+ H100/A100 GPUs recommended. ~249GB file size.' },
  { name: 'DeepSeek-V3 671B (Q4_K_M)', description: '⚠️ ENTERPRISE-ONLY: Full-quality DeepSeek-V3 — for serious reasoning work. Needs 130GB+ RAM.', filename: 'deepseek-v3-0324-q4_k_m.gguf', url: 'https://huggingface.co/bartowski/deepseek-ai_DeepSeek-V3-0324-GGUF/resolve/main/deepseek-ai_DeepSeek-V3-0324-Q4_K_M.gguf?download=true', approx_size_mb: 420000, quantization: 'Q4_K_M', reasoning: true, performance: 5, enterprise_only: true, enterprise_warning: '⚠️ ENTERPRISE-ONLY: 130GB+ RAM, 4+ H100/A100 GPUs required. ~420GB file size. Not for consumer hardware.' },
  { name: 'Qwen3 0.6B Instruct', description: 'Tiny current Qwen3 instruct model for low-memory machines.', filename: 'Qwen3-0.6B-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/Qwen_Qwen3-0.6B-GGUF/resolve/main/Qwen3-0.6B-Q4_K_M.gguf?download=true', approx_size_mb: 620, quantization: 'Q4_K_M', reasoning: false, performance: 3, enterprise_only: false },
  { name: 'Qwen3 1.7B Instruct', description: 'Compact Qwen3 instruct model with strong capability for its size.', filename: 'Qwen3-1.7B-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/Qwen_Qwen3-1.7B-GGUF/resolve/main/Qwen3-1.7B-Q4_K_M.gguf?download=true', approx_size_mb: 1280, quantization: 'Q4_K_M', reasoning: false, performance: 3, enterprise_only: false },
  { name: 'Qwen3 4B Instruct', description: 'Balanced 4B Qwen3 model for general local chat and tools.', filename: 'Qwen3-4B-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/Qwen_Qwen3-4B-GGUF/resolve/main/Qwen3-4B-Q4_K_M.gguf?download=true', approx_size_mb: 2480, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Qwen3 8B Instruct', description: 'Strong general-purpose 8B Qwen3 model.', filename: 'Qwen3-8B-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/Qwen_Qwen3-8B-GGUF/resolve/main/Qwen3-8B-Q4_K_M.gguf?download=true', approx_size_mb: 5000, quantization: 'Q4_K_M', reasoning: false, performance: 5, enterprise_only: false },
  { name: 'Qwen3 14B Instruct', description: 'Mid-size Qwen3 model for higher-quality local reasoning and coding.', filename: 'Qwen3-14B-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/Qwen_Qwen3-14B-GGUF/resolve/main/Qwen3-14B-Q4_K_M.gguf?download=true', approx_size_mb: 9000, quantization: 'Q4_K_M', reasoning: true, performance: 5, enterprise_only: false },
  { name: 'Qwen3 32B Instruct', description: 'High-capability dense Qwen3 model for demanding local workloads.', filename: 'Qwen3-32B-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/Qwen_Qwen3-32B-GGUF/resolve/main/Qwen3-32B-Q4_K_M.gguf?download=true', approx_size_mb: 19760, quantization: 'Q4_K_M', reasoning: true, performance: 5, enterprise_only: true, enterprise_warning: '~20GB model file; high-RAM systems or GPU offload recommended.' },
  { name: 'Qwen3 Next 80B-A3B Instruct', description: 'Large mixture-of-experts Qwen3 Next model for high-end local inference.', filename: 'Qwen3-Next-80B-A3B-Instruct-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/Qwen_Qwen3-Next-80B-A3B-Instruct-GGUF/resolve/main/Qwen3-Next-80B-A3B-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 48730, quantization: 'Q4_K_M', reasoning: true, performance: 5, enterprise_only: true, enterprise_warning: '~49GB model file; workstation-class memory/GPU resources recommended.' },
  { name: 'Qwen2.5 Coder 0.5B Instruct', description: 'Tiny coding model for low-end machines and quick code assistance.', filename: 'Qwen2.5-Coder-0.5B-Instruct-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/Qwen2.5-Coder-0.5B-Instruct-GGUF/resolve/main/Qwen2.5-Coder-0.5B-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 410, quantization: 'Q4_K_M', reasoning: false, performance: 3, enterprise_only: false },
  { name: 'Qwen2.5 Coder 1.5B Instruct', description: 'Compact coding model balancing speed and useful code quality.', filename: 'Qwen2.5-Coder-1.5B-Instruct-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/Qwen2.5-Coder-1.5B-Instruct-GGUF/resolve/main/Qwen2.5-Coder-1.5B-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 1010, quantization: 'Q4_K_M', reasoning: false, performance: 3, enterprise_only: false },
  { name: 'Qwen2.5 Coder 3B Instruct', description: 'Small but capable coding model for local development.', filename: 'Qwen2.5-Coder-3B-Instruct-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/Qwen2.5-Coder-3B-Instruct-GGUF/resolve/main/Qwen2.5-Coder-3B-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 1950, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Qwen2.5 Coder 14B Instruct', description: 'High-quality 14B coding model for more complex programming tasks.', filename: 'Qwen2.5-Coder-14B-Instruct-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/Qwen2.5-Coder-14B-Instruct-GGUF/resolve/main/Qwen2.5-Coder-14B-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 9000, quantization: 'Q4_K_M', reasoning: false, performance: 5, enterprise_only: false },
  { name: 'Qwen2.5 Coder 32B Instruct', description: 'Large coding model for demanding software-engineering workloads.', filename: 'Qwen2.5-Coder-32B-Instruct-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/Qwen2.5-Coder-32B-Instruct-GGUF/resolve/main/Qwen2.5-Coder-32B-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 19500, quantization: 'Q4_K_M', reasoning: false, performance: 5, enterprise_only: true, enterprise_warning: '~20GB model file; high-RAM systems or GPU offload recommended.' },
  { name: 'DeepSeek R1 Distill Llama 70B', description: 'Large distilled reasoning model based on Llama 70B.', filename: 'DeepSeek-R1-Distill-Llama-70B-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/DeepSeek-R1-Distill-Llama-70B-GGUF/resolve/main/DeepSeek-R1-Distill-Llama-70B-Q4_K_M.gguf?download=true', approx_size_mb: 42520, quantization: 'Q4_K_M', reasoning: true, performance: 5, enterprise_only: true, enterprise_warning: '~43GB model file; workstation-class memory/GPU resources recommended.' },
  { name: 'Llama 3.2 1B Instruct', description: 'Small Meta Llama 3.2 instruct model for lightweight local chat.', filename: 'Llama-3.2-1B-Instruct-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf?download=true', approx_size_mb: 808, quantization: 'Q4_K_M', reasoning: false, performance: 3, enterprise_only: false },
  { name: 'Gemma 3 1B IT', description: 'Compact Gemma 3 instruction model.', filename: 'gemma-3-1b-it-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/google_gemma-3-1b-it-GGUF/resolve/main/gemma-3-1b-it-Q4_K_M.gguf?download=true', approx_size_mb: 810, quantization: 'Q4_K_M', reasoning: false, performance: 3, enterprise_only: false },
  { name: 'Gemma 3 4B IT', description: 'Balanced Gemma 3 instruction model with strong general capability.', filename: 'gemma-3-4b-it-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/google_gemma-3-4b-it-GGUF/resolve/main/gemma-3-4b-it-Q4_K_M.gguf?download=true', approx_size_mb: 2490, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Gemma 3 12B IT', description: 'Higher-quality Gemma 3 instruction model for capable local chat.', filename: 'gemma-3-12b-it-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/google_gemma-3-12b-it-GGUF/resolve/main/gemma-3-12b-it-Q4_K_M.gguf?download=true', approx_size_mb: 7300, quantization: 'Q4_K_M', reasoning: false, performance: 5, enterprise_only: false },
  { name: 'Gemma 3 27B IT', description: 'Large Gemma 3 instruction model for demanding local workloads.', filename: 'gemma-3-27b-it-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/google_gemma-3-27b-it-GGUF/resolve/main/gemma-3-27b-it-Q4_K_M.gguf?download=true', approx_size_mb: 16900, quantization: 'Q4_K_M', reasoning: false, performance: 5, enterprise_only: true, enterprise_warning: '~16.5GB model file; high-RAM systems or GPU offload recommended.' },
  { name: 'Gemma 3n E2B IT', description: 'Efficient Gemma 3n model designed for local device-class inference.', filename: 'gemma-3n-E2B-it-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/google_gemma-3n-E2B-it-GGUF/resolve/main/gemma-3n-E2B-it-Q4_K_M.gguf?download=true', approx_size_mb: 2860, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Gemma 3n E4B IT', description: 'Larger efficient Gemma 3n model with improved quality.', filename: 'gemma-3n-E4B-it-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/google_gemma-3n-E4B-it-GGUF/resolve/main/gemma-3n-E4B-it-Q4_K_M.gguf?download=true', approx_size_mb: 4340, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Phi-4', description: "Microsoft's 14B-class reasoning and instruction model.", filename: 'phi-4-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/phi-4-GGUF/resolve/main/phi-4-Q4_K_M.gguf?download=true', approx_size_mb: 9280, quantization: 'Q4_K_M', reasoning: true, performance: 5, enterprise_only: false },
  { name: 'Phi-4 Mini Instruct', description: 'Compact Microsoft Phi-4 model for efficient local inference.', filename: 'Phi-4-mini-instruct-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/microsoft_Phi-4-mini-instruct-GGUF/resolve/main/Phi-4-mini-instruct-Q4_K_M.gguf?download=true', approx_size_mb: 2500, quantization: 'Q4_K_M', reasoning: true, performance: 4, enterprise_only: false },
  { name: 'Mistral Nemo Instruct 2407', description: '12B Mistral instruction model with a strong quality-to-size ratio.', filename: 'Mistral-Nemo-Instruct-2407-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/Mistral-Nemo-Instruct-2407-GGUF/resolve/main/Mistral-Nemo-Instruct-2407-Q4_K_M.gguf?download=true', approx_size_mb: 7480, quantization: 'Q4_K_M', reasoning: false, performance: 5, enterprise_only: false },
  { name: 'Mistral Small 3.1 24B Instruct', description: '24B Mistral Small model with strong general chat and multimodal support.', filename: 'Mistral-Small-3.1-24B-Instruct-2503-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/mistralai_Mistral-Small-3.1-24B-Instruct-2503-GGUF/resolve/main/Mistral-Small-3.1-24B-Instruct-2503-Q4_K_M.gguf?download=true', approx_size_mb: 14700, quantization: 'Q4_K_M', reasoning: false, performance: 5, enterprise_only: true, enterprise_warning: '~14GB model file; high-RAM systems or GPU offload recommended.' },
  { name: 'Mistral Small 3.2 24B Instruct', description: 'Current Mistral Small 3.2 24B instruction model.', filename: 'Mistral-Small-3.2-24B-Instruct-2506-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/mistralai_Mistral-Small-3.2-24B-Instruct-2506-GGUF/resolve/main/Mistral-Small-3.2-24B-Instruct-2506-Q4_K_M.gguf?download=true', approx_size_mb: 14330, quantization: 'Q4_K_M', reasoning: false, performance: 5, enterprise_only: true, enterprise_warning: '~14GB model file; high-RAM systems or GPU offload recommended.' },
  { name: 'Ministral 8B Instruct 2410', description: 'Compact Mistral family model tuned for efficient inference.', filename: 'Ministral-8B-Instruct-2410-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/Ministral-8B-Instruct-2410-GGUF/resolve/main/Ministral-8B-Instruct-2410-Q4_K_M.gguf?download=true', approx_size_mb: 4910, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Codestral 22B v0.1', description: '22B code-specialized Mistral model for programming and code completion.', filename: 'Codestral-22B-v0.1-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/Codestral-22B-v0.1-GGUF/resolve/main/Codestral-22B-v0.1-Q4_K_M.gguf?download=true', approx_size_mb: 13300, quantization: 'Q4_K_M', reasoning: false, performance: 5, enterprise_only: true, enterprise_warning: '~13GB model file; high-RAM systems or GPU offload recommended.' },
  { name: 'Aya Expanse 8B', description: 'Multilingual instruction model optimized for broad language coverage.', filename: 'aya-expanse-8b-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/aya-expanse-8b-GGUF/resolve/main/aya-expanse-8b-Q4_K_M.gguf?download=true', approx_size_mb: 5060, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Command R Plus', description: 'Large Cohere model suited to retrieval, long-context tasks, and assistant workloads.', filename: 'c4ai-command-r-plus-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/c4ai-command-r-plus-GGUF/resolve/main/c4ai-command-r-plus-Q4_K_M.gguf?download=true', approx_size_mb: 62750, quantization: 'Q4_K_M', reasoning: false, performance: 5, enterprise_only: true, enterprise_warning: '~63GB model file; enterprise/workstation hardware recommended.' },
  { name: 'Granite 3.1 2B Instruct', description: 'Compact IBM Granite 3.1 instruct model for enterprise-style local tasks.', filename: 'granite-3.1-2b-instruct-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/granite-3.1-2b-instruct-GGUF/resolve/main/granite-3.1-2b-instruct-Q4_K_M.gguf?download=true', approx_size_mb: 1590, quantization: 'Q4_K_M', reasoning: false, performance: 3, enterprise_only: false },
  { name: 'Granite 3.1 8B Instruct', description: 'Stronger IBM Granite 3.1 model for general local workloads.', filename: 'granite-3.1-8b-instruct-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/granite-3.1-8b-instruct-GGUF/resolve/main/granite-3.1-8b-instruct-Q4_K_M.gguf?download=true', approx_size_mb: 4940, quantization: 'Q4_K_M', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Devstral Small 2 24B Instruct', description: 'Current Mistral coding-agent model tuned for software engineering workflows.', filename: 'mistralai_Devstral-Small-2-24B-Instruct-2512-Q4_K_M.gguf', url: 'https://huggingface.co/bartowski/mistralai_Devstral-Small-2-24B-Instruct-2512-GGUF/resolve/main/mistralai_Devstral-Small-2-24B-Instruct-2512-Q4_K_M.gguf?download=true', approx_size_mb: 14500, quantization: 'Q4_K_M', reasoning: false, performance: 5, enterprise_only: true, enterprise_warning: '~14.5GB model file; high-RAM systems or GPU offload recommended.' },
  { name: 'Qwen3 8B Instruct Q6_K', description: 'Higher-quality Q6_K build of Qwen3 8B.', filename: 'Qwen3-8B-Q6_K.gguf', url: 'https://huggingface.co/bartowski/Qwen_Qwen3-8B-GGUF/resolve/main/Qwen3-8B-Q6_K.gguf?download=true', approx_size_mb: 6500, quantization: 'Q6_K', reasoning: false, performance: 5, enterprise_only: false },
  { name: 'Qwen3 14B Instruct Q6_K', description: 'Higher-quality Q6_K build of Qwen3 14B.', filename: 'Qwen3-14B-Q6_K.gguf', url: 'https://huggingface.co/bartowski/Qwen_Qwen3-14B-GGUF/resolve/main/Qwen3-14B-Q6_K.gguf?download=true', approx_size_mb: 11500, quantization: 'Q6_K', reasoning: true, performance: 5, enterprise_only: true, enterprise_warning: '~11.5GB model file; high-RAM systems or GPU offload recommended.' },
  { name: 'Qwen3 32B Instruct Q6_K', description: 'Higher-quality Q6_K build of Qwen3 32B.', filename: 'Qwen3-32B-Q6_K.gguf', url: 'https://huggingface.co/bartowski/Qwen_Qwen3-32B-GGUF/resolve/main/Qwen3-32B-Q6_K.gguf?download=true', approx_size_mb: 26880, quantization: 'Q6_K', reasoning: true, performance: 5, enterprise_only: true, enterprise_warning: '~27GB model file; workstation-class memory/GPU resources recommended.' },
  { name: 'Qwen2.5 Coder 7B Instruct Q6_K', description: 'Higher-quality Q6_K coding build for maximum quality within the 7B class.', filename: 'Qwen2.5-Coder-7B-Instruct-Q6_K.gguf', url: 'https://huggingface.co/bartowski/Qwen2.5-Coder-7B-Instruct-GGUF/resolve/main/Qwen2.5-Coder-7B-Instruct-Q6_K.gguf?download=true', approx_size_mb: 6390, quantization: 'Q6_K', reasoning: false, performance: 5, enterprise_only: false },
  { name: 'Gemma 3 12B IT Q6_K', description: 'Higher-quality Q6_K Gemma 3 12B build.', filename: 'gemma-3-12b-it-Q6_K.gguf', url: 'https://huggingface.co/bartowski/google_gemma-3-12b-it-GGUF/resolve/main/gemma-3-12b-it-Q6_K.gguf?download=true', approx_size_mb: 8000, quantization: 'Q6_K', reasoning: false, performance: 5, enterprise_only: true, enterprise_warning: '~8GB model file; high-RAM systems or GPU offload recommended.' },
  { name: 'Gemma 3 27B IT Q6_K', description: 'Higher-quality Q6_K Gemma 3 27B build.', filename: 'gemma-3-27b-it-Q6_K.gguf', url: 'https://huggingface.co/bartowski/google_gemma-3-27b-it-GGUF/resolve/main/gemma-3-27b-it-Q6_K.gguf?download=true', approx_size_mb: 18700, quantization: 'Q6_K', reasoning: false, performance: 5, enterprise_only: true, enterprise_warning: '~19GB model file; high-RAM systems or GPU offload recommended.' },
  { name: 'Phi-4 Q6_K', description: 'Higher-quality Q6_K build of Phi-4.', filename: 'phi-4-Q6_K.gguf', url: 'https://huggingface.co/bartowski/phi-4-GGUF/resolve/main/phi-4-Q6_K.gguf?download=true', approx_size_mb: 12300, quantization: 'Q6_K', reasoning: true, performance: 5, enterprise_only: true, enterprise_warning: '~12GB model file; high-RAM systems or GPU offload recommended.' },
  { name: 'Mistral Nemo Instruct 2407 Q6_K', description: 'Higher-quality Q6_K Mistral Nemo build.', filename: 'Mistral-Nemo-Instruct-2407-Q6_K.gguf', url: 'https://huggingface.co/bartowski/Mistral-Nemo-Instruct-2407-GGUF/resolve/main/Mistral-Nemo-Instruct-2407-Q6_K.gguf?download=true', approx_size_mb: 10060, quantization: 'Q6_K', reasoning: false, performance: 5, enterprise_only: true, enterprise_warning: '~10GB model file; high-RAM systems or GPU offload recommended.' },
  { name: 'Devstral Small 2 24B Instruct Q6_K', description: 'Higher-quality Q6_K build of Devstral Small 2 for coding-agent workloads.', filename: 'mistralai_Devstral-Small-2-24B-Instruct-2512-Q6_K.gguf', url: 'https://huggingface.co/bartowski/mistralai_Devstral-Small-2-24B-Instruct-2512-GGUF/resolve/main/mistralai_Devstral-Small-2-24B-Instruct-2512-Q6_K.gguf?download=true', approx_size_mb: 20000, quantization: 'Q6_K', reasoning: false, performance: 5, enterprise_only: true, enterprise_warning: '~20GB model file; workstation-class memory/GPU resources recommended.' },
  { name: 'Mistral Small 3.2 24B Instruct Q6_K', description: 'Higher-quality Q6_K build of Mistral Small 3.2.', filename: 'Mistral-Small-3.2-24B-Instruct-2506-Q6_K.gguf', url: 'https://huggingface.co/bartowski/mistralai_Mistral-Small-3.2-24B-Instruct-2506-GGUF/resolve/main/Mistral-Small-3.2-24B-Instruct-2506-Q6_K.gguf?download=true', approx_size_mb: 19600, quantization: 'Q6_K', reasoning: false, performance: 5, enterprise_only: true, enterprise_warning: '~20GB model file; workstation-class memory/GPU resources recommended.' },
  { name: 'Command R Plus Q5_K_M', description: 'Higher-quality Q5_K_M build of Command R Plus.', filename: 'c4ai-command-r-plus-Q5_K_M.gguf', url: 'https://huggingface.co/bartowski/c4ai-command-r-plus-GGUF/resolve/main/c4ai-command-r-plus-Q5_K_M.gguf?download=true', approx_size_mb: 73620, quantization: 'Q5_K_M', reasoning: false, performance: 5, enterprise_only: true, enterprise_warning: '~74GB model file; enterprise/workstation hardware recommended.' },
  { name: 'StableLM 2 Zephyr 1.6B Q6_K', description: 'Higher-quality Q6_K build of StableLM 2 Zephyr 1.6B.', filename: 'stablelm-2-zephyr-1_6b.q6_k.gguf', url: 'https://huggingface.co/afrideva/stablelm-2-zephyr-1_6b-GGUF/resolve/main/stablelm-2-zephyr-1_6b.q6_k.gguf?download=true', approx_size_mb: 1500, quantization: 'Q6_K', reasoning: false, performance: 3, enterprise_only: false },
  { name: 'Qwen3 4B Instruct Q6_K', description: 'Higher-quality Q6_K build of Qwen3 4B.', filename: 'Qwen3-4B-Q6_K.gguf', url: 'https://huggingface.co/bartowski/Qwen_Qwen3-4B-GGUF/resolve/main/Qwen3-4B-Q6_K.gguf?download=true', approx_size_mb: 3400, quantization: 'Q6_K', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Qwen2.5 Coder 14B Instruct Q6_K', description: 'Higher-quality Q6_K build of Qwen2.5 Coder 14B.', filename: 'Qwen2.5-Coder-14B-Instruct-Q6_K.gguf', url: 'https://huggingface.co/bartowski/Qwen2.5-Coder-14B-Instruct-GGUF/resolve/main/Qwen2.5-Coder-14B-Instruct-Q6_K.gguf?download=true', approx_size_mb: 11500, quantization: 'Q6_K', reasoning: false, performance: 5, enterprise_only: true, enterprise_warning: '~11.5GB model file; high-RAM systems or GPU offload recommended.' },
  { name: 'Mistral Small 3.2 24B Instruct Q5_K_M', description: 'Higher-quality Q5_K_M build of Mistral Small 3.2.', filename: 'Mistral-Small-3.2-24B-Instruct-2506-Q5_K_M.gguf', url: 'https://huggingface.co/bartowski/mistralai_Mistral-Small-3.2-24B-Instruct-2506-GGUF/resolve/main/Mistral-Small-3.2-24B-Instruct-2506-Q5_K_M.gguf?download=true', approx_size_mb: 16600, quantization: 'Q5_K_M', reasoning: false, performance: 5, enterprise_only: true, enterprise_warning: '~16.6GB model file; high-RAM systems or GPU offload recommended.' },
  { name: 'Qwen3 0.6B Instruct Q6_K', description: 'Higher-quality Q6_K build of Qwen3 0.6B.', filename: 'Qwen3-0.6B-Q6_K.gguf', url: 'https://huggingface.co/bartowski/Qwen_Qwen3-0.6B-GGUF/resolve/main/Qwen3-0.6B-Q6_K.gguf?download=true', approx_size_mb: 870, quantization: 'Q6_K', reasoning: false, performance: 3, enterprise_only: false },
  { name: 'Qwen3 1.7B Instruct Q6_K', description: 'Higher-quality Q6_K build of Qwen3 1.7B.', filename: 'Qwen3-1.7B-Q6_K.gguf', url: 'https://huggingface.co/bartowski/Qwen_Qwen3-1.7B-GGUF/resolve/main/Qwen3-1.7B-Q6_K.gguf?download=true', approx_size_mb: 1700, quantization: 'Q6_K', reasoning: false, performance: 4, enterprise_only: false },
  { name: 'Gemma 3n E4B IT Q6_K', description: 'Higher-quality Q6_K build of Gemma 3n E4B IT.', filename: 'gemma-3n-E4B-it-Q6_K.gguf', url: 'https://huggingface.co/bartowski/google_gemma-3n-E4B-it-GGUF/resolve/main/gemma-3n-E4B-it-Q6_K.gguf?download=true', approx_size_mb: 5400, quantization: 'Q6_K', reasoning: false, performance: 4, enterprise_only: false }
];

interface Model {
  name: string;
  description: string;
  filename: string;
  url: string;
  approx_size_mb: number;
  quantization: string;
  reasoning: boolean;
  performance: number;
  enterprise_only: boolean;
  enterprise_warning?: string;
}

interface InstalledModel {
  id: string;
  name: string;
  filename: string;
  path: string;
  size_mb: number;
  quantization: string;
  reasoning: boolean;
  coding: boolean;
  active: boolean;
  params_billion: number | null;
  artifacts_supported: boolean;
}

interface VersionInfo {
  version: string;
}

type View = 'home' | 'models' | 'documentation';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [installedModels, setInstalledModels] = useState<InstalledModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [version, setVersion] = useState<string>('1.0.0');
  const [loading, setLoading] = useState(true);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<Record<string, { status: string; progress: number }>>({});

  useEffect(() => {
    // Fetch version
    fetch('/version.json')
      .then(res => res.json())
      .then((data: VersionInfo) => setVersion(data.version))
      .catch(() => setVersion('1.0.0'));

    // Fetch installed models
    fetchInstalledModels();
  }, []);

  const fetchInstalledModels = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/models');
      if (response.ok) {
        const data = await response.json();
        setInstalledModels(data.models || []);
        setActiveModel(data.active_model || null);
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = 'https://github.com/pac3offici-dotcom/moth/releases/download/v1.0.0/Moth-Windows-x64-v1.0.0.zip';
    link.download = 'Moth-Windows-x64-v1.0.0.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  };

  const handleDownloadModel = async (model: Model) => {
    try {
      setDownloadStatus(prev => ({ ...prev, [model.filename]: { status: 'downloading', progress: 0 } }));
      const response = await fetch('/api/models/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: model.url, filename: model.filename })
      });
      if (response.ok) {
        // Poll for progress
        const pollInterval = setInterval(async () => {
          const progressResponse = await fetch(`/api/models/download/progress/${model.filename}`);
          if (progressResponse.ok) {
            const data = await progressResponse.json();
            if (data.status === 'done') {
              setDownloadStatus(prev => ({ ...prev, [model.filename]: { status: 'done', progress: 100 } }));
              clearInterval(pollInterval);
              fetchInstalledModels();
            } else if (data.status === 'error') {
              setDownloadStatus(prev => ({ ...prev, [model.filename]: { status: 'error', progress: 0 } }));
              clearInterval(pollInterval);
            } else {
              const progress = data.total_mb ? (data.downloaded_mb / data.total_mb) * 100 : 0;
              setDownloadStatus(prev => ({ ...prev, [model.filename]: { status: 'downloading', progress: Math.min(progress, 99) } }));
            }
          }
        }, 1000);
        setTimeout(() => clearInterval(pollInterval), 120000);
      }
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadStatus(prev => ({ ...prev, [model.filename]: { status: 'error', progress: 0 } }));
    }
  };

  const handleLoadModel = async (filename: string) => {
    try {
      await fetch('/api/models/load', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename })
      });
      fetchInstalledModels();
    } catch (error) {
      console.error('Failed to load model:', error);
    }
  };

  const handleUnloadModel = async () => {
    try {
      await fetch('/api/models/unload', { method: 'POST' });
      fetchInstalledModels();
    } catch (error) {
      console.error('Failed to unload model:', error);
    }
  };

  const isModelInstalled = (filename: string) => {
    return installedModels.some(m => m.filename === filename);
  };

  const getInstalledModel = (filename: string) => {
    return installedModels.find(m => m.filename === filename);
  };

  // Combine library models with installed status
  const libraryModels = MODEL_LIBRARY.map(model => ({
    ...model,
    installed: isModelInstalled(model.filename),
    installedModel: getInstalledModel(model.filename)
  }));

  const filteredModels = libraryModels.filter(model => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    const searchable = [
      model.name,
      model.description,
      model.filename,
      model.quantization,
      String(model.approx_size_mb)
    ].join(' ').toLowerCase();
    return searchable.includes(query);
  });

  const renderHome = () => (
    <div className="page home-page">
      <section className="hero">
        <h1 className="hero-title">
          Download Moth
        </h1>
        <p className="hero-description">
          A simple, private developer runtime for working with local AI models.
          Download once, run anywhere on your own hardware.
        </p>
        <div className="hero-actions">
          <button className="primary-btn" onClick={handleDownload}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download for Windows
          </button>
          <span className="hero-version">v{version} · Windows x64</span>
        </div>
      </section>

      <section className="install-section">
        <h2 className="section-title">Install</h2>
        <div className="install-steps">
          <div className="step">
            <span className="step-number">01</span>
            <span className="step-text">Download the installer</span>
          </div>
          <div className="step">
            <span className="step-number">02</span>
            <span className="step-text">Run the executable</span>
          </div>
          <div className="step">
            <span className="step-number">03</span>
            <span className="step-text">Launch the application</span>
          </div>
          <div className="step">
            <span className="step-number">04</span>
            <span className="step-text">Browse and download a model</span>
          </div>
          <div className="step">
            <span className="step-number">05</span>
            <span className="step-text">Start using the runtime</span>
          </div>
        </div>
      </section>
    </div>
  );

  const renderModels = () => (
    <div className="page models-page">
      <div className="models-header">
        <h1 className="page-title">Models</h1>
        <p className="page-subtitle">Browse and discover available AI models for local inference.</p>
        <div className="search-container">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>
              ×
            </button>
          )}
        </div>
        {activeModel && (
          <div className="active-model-indicator">
            <span className="active-dot" />
            Active: {installedModels.find(m => m.filename === activeModel)?.name || activeModel}
            <button className="unload-btn" onClick={handleUnloadModel}>Unload</button>
          </div>
        )}
        <div className="model-stats">
          <span>{installedModels.length} installed</span>
          <span>·</span>
          <span>{MODEL_LIBRARY.length} available in library</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading models...</div>
      ) : filteredModels.length === 0 ? (
        <div className="empty-state">
          <p>No models found.</p>
          <p className="empty-hint">Try adjusting your search or browse the model library.</p>
        </div>
      ) : (
        <div className="models-grid">
          {filteredModels.map((model) => (
            <div
              key={model.filename}
              className={`model-card ${model.installed && model.installedModel?.active ? 'active' : ''} ${model.enterprise_only ? 'enterprise' : ''}`}
              onClick={() => setSelectedModel(model)}
            >
              <div className="model-card-header">
                <h3 className="model-name">{model.name}</h3>
                {model.installed && model.installedModel?.active && (
                  <span className="model-active-badge">Active</span>
                )}
                {model.installed && !model.installedModel?.active && (
                  <span className="model-installed-badge">Installed</span>
                )}
                {model.enterprise_only && (
                  <span className="model-enterprise-badge">Enterprise</span>
                )}
              </div>
              <p className="model-description">{model.description}</p>
              <div className="model-meta">
                <span>{model.approx_size_mb} MB</span>
                <span>{model.quantization}</span>
                <span>{model.reasoning ? 'Reasoning' : 'General'}</span>
                <span>{model.performance} / 5</span>
              </div>
              <div className="model-card-footer">
                <span className="model-filename">{model.filename}</span>
                {model.installed ? (
                  <span className="view-link">View</span>
                ) : (
                  <span className="view-link">Download</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedModel && (
        <div className="modal-overlay" onClick={() => setSelectedModel(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedModel(null)}>×</button>
            <div className="modal-header">
              <h2 className="modal-title">{selectedModel.name}</h2>
              {selectedModel.enterprise_only && (
                <span className="model-enterprise-badge">Enterprise</span>
              )}
              {selectedModel.installed && selectedModel.installedModel?.active && (
                <span className="model-active-badge">Active</span>
              )}
            </div>
            <div className="modal-body">
              <p className="modal-description">{selectedModel.description}</p>

              <div className="modal-section">
                <h4>Overview</h4>
                <div className="modal-metadata">
                  <div className="metadata-row">
                    <span className="metadata-label">Filename</span>
                    <span className="metadata-value">{selectedModel.filename}</span>
                  </div>
                  <div className="metadata-row">
                    <span className="metadata-label">Size</span>
                    <span className="metadata-value">{selectedModel.approx_size_mb} MB</span>
                  </div>
                  <div className="metadata-row">
                    <span className="metadata-label">Quantization</span>
                    <span className="metadata-value">{selectedModel.quantization}</span>
                  </div>
                  <div className="metadata-row">
                    <span className="metadata-label">Performance</span>
                    <span className="metadata-value">{selectedModel.performance} / 5</span>
                  </div>
                  <div className="metadata-row">
                    <span className="metadata-label">Reasoning</span>
                    <span className="metadata-value">{selectedModel.reasoning ? 'Yes' : 'No'}</span>
                  </div>
                  {selectedModel.enterprise_warning && (
                    <div className="metadata-row full-width">
                      <span className="metadata-label enterprise-warning-label">⚠️</span>
                      <span className="metadata-value enterprise-warning-value">{selectedModel.enterprise_warning}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-section">
                <h4>Get this model</h4>
                <div className="download-info">
                  <p className="download-hint">Moth downloads the model file from Hugging Face and saves it to your model directory. Once it's downloaded, load it to make it the active model.</p>
                  <p className="download-url">{selectedModel.url}</p>
                  {selectedModel.installed ? (
                    <div className="modal-actions">
                      {!selectedModel.installedModel?.active && (
                        <button 
                          className="primary-btn small" 
                          onClick={() => handleLoadModel(selectedModel.filename)}
                        >
                          Load Model
                        </button>
                      )}
                      <span className="installed-status">✓ Installed</span>
                    </div>
                  ) : (
                    <div className="modal-actions">
                      {downloadStatus[selectedModel.filename]?.status === 'downloading' ? (
                        <div className="download-progress">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${downloadStatus[selectedModel.filename].progress}%` }}
                            />
                          </div>
                          <span className="progress-text">
                            {Math.round(downloadStatus[selectedModel.filename].progress)}%
                          </span>
                        </div>
                      ) : downloadStatus[selectedModel.filename]?.status === 'error' ? (
                        <span className="error-text">Download failed. Try again.</span>
                      ) : (
                        <button 
                          className="primary-btn small" 
                          onClick={() => handleDownloadModel(selectedModel)}
                        >
                          Download Model
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-section">
                <h4>Use it</h4>
                <p className="usage-hint">Once this model is loaded, send it requests from your own code using Moth's local, OpenAI-compatible API:</p>
                <div className="code-block compact">
                  <div className="code-header">
                    <span className="code-lang">HTTP</span>
                    <button className="copy-btn" onClick={() => handleCopy(`POST /v1/chat/completions\n{\n  "model": "${selectedModel.filename}",\n  "messages": [{"role": "user", "content": "Hello"}]\n}`)}>
                      Copy
                    </button>
                  </div>
                  <code className="code-content">{`POST /v1/chat/completions\n{\n  "model": "${selectedModel.filename}",\n  "messages": [{"role": "user", "content": "Hello"}]\n}`}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDocumentation = () => (
    <div className="page docs-page">
      <div className="docs-layout">
        <nav className="docs-nav">
          <h3 className="docs-nav-title">Documentation</h3>
          <ul className="docs-nav-list">
            <li><a href="#getting-started" className="docs-nav-link active">Getting Started</a></li>
            <li><a href="#installation" className="docs-nav-link">Installation</a></li>
            <li><a href="#models" className="docs-nav-link">Models</a></li>
            <li><a href="#api" className="docs-nav-link">API Reference</a></li>
            <li><a href="#configuration" className="docs-nav-link">Configuration</a></li>
            <li><a href="#troubleshooting" className="docs-nav-link">Troubleshooting</a></li>
          </ul>
        </nav>
        <main className="docs-content">
          <section id="getting-started" className="docs-section">
            <h1>Getting Started</h1>
            <p>Moth is a local AI runtime that lets you run large language models on your own hardware. No cloud dependencies, no API keys, no data leaving your machine.</p>
            
            <h2>What is Moth?</h2>
            <p>Moth is a lightweight backend server that:</p>
            <ul>
              <li>Runs GGUF-format language models locally</li>
              <li>Exposes multiple API formats (Native, OpenAI, Anthropic, Ollama)</li>
              <li>Supports artifact generation (flashcards, quizzes, timelines, etc.)</li>
              <li>Includes a model discovery and download system</li>
              <li>Works with GPU acceleration when available</li>
            </ul>
            <div className="docs-callout">
              <p><strong>Privacy-first:</strong> All inference happens on your machine. Your data never leaves your hardware.</p>
            </div>
          </section>

          <section id="installation" className="docs-section">
            <h2>Installation</h2>
            <h3>Windows</h3>
            <p>Download the installer from the <a href="#home" onClick={() => setCurrentView('home')}>home page</a> and run it.</p>

            <h3>Configuration</h3>
            <p>Moth uses environment variables for configuration:</p>
            <div className="code-block compact">
              <div className="code-header">
                <span className="code-lang">env</span>
                <button className="copy-btn" onClick={() => handleCopy('MOTH_HOST=127.0.0.1\nMOTH_PORT=8000\nMOTH_MODEL_DIR=./models\nMOTH_API_KEY=your-secret-key')}>Copy</button>
              </div>
              <code className="code-content">MOTH_HOST=127.0.0.1<br />MOTH_PORT=8000<br />MOTH_MODEL_DIR=./models<br />MOTH_API_KEY=your-secret-key</code>
            </div>
          </section>

          <section id="models" className="docs-section">
            <h2>Models</h2>
            <p>Moth uses GGUF format models. Browse the <a href="#models" onClick={() => setCurrentView('models')}>Models page</a> to discover available models.</p>

            <h3>Model Directory</h3>
            <p>Models are stored in the directory specified by <code>MOTH_MODEL_DIR</code> (default: <code>~/Moth/models</code> on Windows).</p>

            <h3>Downloading Models</h3>
            <div className="code-block compact">
              <div className="code-header">
                <span className="code-lang">HTTP</span>
                <button className="copy-btn" onClick={() => handleCopy('POST /api/models/download\n{\n  "url": "https://huggingface.co/.../model.gguf",\n  "filename": "model.gguf"\n}')}>Copy</button>
              </div>
              <code className="code-content">POST /api/models/download<br />{`{\n  "url": "https://huggingface.co/.../model.gguf",\n  "filename": "model.gguf"\n}`}</code>
            </div>

            <h3>Loading Models</h3>
            <div className="code-block compact">
              <div className="code-header">
                <span className="code-lang">HTTP</span>
                <button className="copy-btn" onClick={() => handleCopy('POST /api/models/load\n{\n  "filename": "model.gguf"\n}')}>Copy</button>
              </div>
              <code className="code-content">POST /api/models/load<br />{`{\n  "filename": "model.gguf"\n}`}</code>
            </div>
          </section>

          <section id="api" className="docs-section">
            <h2>API Reference</h2>
            <p>Moth exposes multiple API formats for maximum compatibility with existing tools and libraries.</p>

            <div className="docs-callout">
              <p><strong>All endpoints:</strong> <code>http://localhost:8000</code> (configurable via <code>MOTH_HOST</code> and <code>MOTH_PORT</code>)</p>
            </div>

            <h3>Working Endpoints</h3>
            <table className="docs-table">
              <thead>
                <tr>
                  <th>Endpoint</th>
                  <th>Format</th>
                  <th>Use Case</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>/api/chat</code></td>
                  <td>Native Moth</td>
                  <td>Primary interface for Moth UI &amp; scripts</td>
                  <td><span className="status-badge success">✅ Working</span></td>
                </tr>
                <tr>
                  <td><code>/v1/messages</code></td>
                  <td>Anthropic</td>
                  <td>For Anthropic SDKs &amp; Claude-compatible tools</td>
                  <td><span className="status-badge success">✅ Working</span></td>
                </tr>
                <tr>
                  <td><code>/api/chat</code> (with <code>model</code> field)</td>
                  <td>Ollama</td>
                  <td>For Ollama-compatible clients</td>
                  <td><span className="status-badge success">✅ Working</span></td>
                </tr>
                <tr>
                  <td><code>/api/models</code></td>
                  <td>Native</td>
                  <td>List installed models</td>
                  <td><span className="status-badge success">✅ Working</span></td>
                </tr>
                <tr>
                  <td><code>/api/models/load</code></td>
                  <td>Native</td>
                  <td>Load a model</td>
                  <td><span className="status-badge success">✅ Working</span></td>
                </tr>
                <tr>
                  <td><code>/api/health</code></td>
                  <td>Native</td>
                  <td>Health check</td>
                  <td><span className="status-badge success">✅ Working</span></td>
                </tr>
                <tr>
                  <td><code>/api/stats</code></td>
                  <td>Native</td>
                  <td>Server statistics</td>
                  <td><span className="status-badge success">✅ Working</span></td>
                </tr>
                <tr>
                  <td><code>/api/system/info</code></td>
                  <td>Native</td>
                  <td>System information</td>
                  <td><span className="status-badge success">✅ Working</span></td>
                </tr>
                <tr>
                  <td><code>/api/network/status</code></td>
                  <td>Native</td>
                  <td>Network access status</td>
                  <td><span className="status-badge success">✅ Working</span></td>
                </tr>
                <tr>
                  <td><code>/api/network/enable</code></td>
                  <td>Native</td>
                  <td>Enable LAN access</td>
                  <td><span className="status-badge success">✅ Working</span></td>
                </tr>
              </tbody>
            </table>

            <h3>Known Issue: OpenAI-Compatible Endpoint</h3>
            <div className="docs-warning">
              <p><strong>Endpoint:</strong> <code>/v1/chat/completions</code></p>
              <p><strong>Issue:</strong> Validation error with <code>usage.prompt_tokens_details</code> field</p>
              <div className="code-block compact">
                <div className="code-header">
                  <span className="code-lang">Error</span>
                </div>
                <code className="code-content">{`{
  "error": {
    "message": "1 validation error for ChatCompletionResponse\\nusage.prompt_tokens_details\\nInput should be a valid integer",
    "type": "server_error"
  }
}`}</code>
              </div>
              <p><strong>Workaround:</strong> Use <code>/api/chat</code> instead – it accepts the same OpenAI-style messages format without the validation bug.</p>
              <p><strong>Fix planned:</strong> Will be resolved in a future update (the response schema needs to accept the nested <code>prompt_tokens_details</code> object that llama.cpp returns).</p>
            </div>

            <h3>Quick Reference: API Usage Examples</h3>

            <h4>1. Native Moth API (Recommended)</h4>
            <div className="code-block compact">
              <div className="code-header">
                <span className="code-lang">HTTP</span>
                <button className="copy-btn" onClick={() => handleCopy(`curl -X POST http://localhost:8000/api/chat \\\n  -H "Content-Type: application/json" \\\n  -d '{"messages": [{"role": "user", "content": "Hello"}], "stream": false}'`)}>Copy</button>
              </div>
              <code className="code-content">{`curl -X POST http://localhost:8000/api/chat \\\n  -H "Content-Type: application/json" \\\n  -d '{"messages": [{"role": "user", "content": "Hello"}], "stream": false}'`}</code>
            </div>

            <h4>2. Anthropic-Compatible API</h4>
            <div className="code-block compact">
              <div className="code-header">
                <span className="code-lang">HTTP</span>
                <button className="copy-btn" onClick={() => handleCopy(`curl -X POST http://localhost:8000/v1/messages \\\n  -H "Content-Type: application/json" \\\n  -d '{"model": "gemma-2-2b-it-q4_k_m.gguf", "messages": [{"role": "user", "content": "Hello"}], "max_tokens": 100}'`)}>Copy</button>
              </div>
              <code className="code-content">{`curl -X POST http://localhost:8000/v1/messages \\\n  -H "Content-Type: application/json" \\\n  -d '{"model": "gemma-2-2b-it-q4_k_m.gguf", "messages": [{"role": "user", "content": "Hello"}], "max_tokens": 100}'`}</code>
            </div>

            <h4>3. Ollama-Compatible API</h4>
            <div className="code-block compact">
              <div className="code-header">
                <span className="code-lang">HTTP</span>
                <button className="copy-btn" onClick={() => handleCopy(`curl -X POST http://localhost:8000/api/chat \\\n  -H "Content-Type: application/json" \\\n  -d '{"model": "gemma-2-2b-it-q4_k_m.gguf", "messages": [{"role": "user", "content": "Hello"}], "stream": false}'`)}>Copy</button>
              </div>
              <code className="code-content">{`curl -X POST http://localhost:8000/api/chat \\\n  -H "Content-Type: application/json" \\\n  -d '{"model": "gemma-2-2b-it-q4_k_m.gguf", "messages": [{"role": "user", "content": "Hello"}], "stream": false}'`}</code>
            </div>

            <h4>4. Streaming Response</h4>
            <div className="code-block compact">
              <div className="code-header">
                <span className="code-lang">HTTP</span>
                <button className="copy-btn" onClick={() => handleCopy(`curl -X POST http://localhost:8000/api/chat \\\n  -H "Content-Type: application/json" \\\n  -d '{"messages": [{"role": "user", "content": "Tell me a joke"}], "stream": true}'`)}>Copy</button>
              </div>
              <code className="code-content">{`curl -X POST http://localhost:8000/api/chat \\\n  -H "Content-Type: application/json" \\\n  -d '{"messages": [{"role": "user", "content": "Tell me a joke"}], "stream": true}'`}</code>
            </div>

            <h3>Python SDK Example</h3>
            <div className="code-block compact">
              <div className="code-header">
                <span className="code-lang">Python</span>
                <button className="copy-btn" onClick={() => handleCopy(`import requests\n\n# Using the native API\nresponse = requests.post(\n    "http://localhost:8000/api/chat",\n    json={\n        "messages": [{"role": "user", "content": "What is 2+2?"}],\n        "stream": False\n    }\n)\nprint(response.json()["message"]["content"])\n\n# Streaming\nresponse = requests.post(\n    "http://localhost:8000/api/chat",\n    json={\n        "messages": [{"role": "user", "content": "Tell me a story"}],\n        "stream": True\n    },\n    stream=True\n)\n\nfor line in response.iter_lines():\n    if line:\n        import json\n        data = json.loads(line)\n        if "token" in data:\n            print(data["token"], end="")`)}>Copy</button>
              </div>
              <code className="code-content">{`import requests\n\n# Using the native API\nresponse = requests.post(\n    "http://localhost:8000/api/chat",\n    json={\n        "messages": [{"role": "user", "content": "What is 2+2?"}],\n        "stream": False\n    }\n)\nprint(response.json()["message"]["content"])\n\n# Streaming\nresponse = requests.post(\n    "http://localhost:8000/api/chat",\n    json={\n        "messages": [{"role": "user", "content": "Tell me a story"}],\n        "stream": True\n    },\n    stream=True\n)\n\nfor line in response.iter_lines():\n    if line:\n        import json\n        data = json.loads(line)\n        if "token" in data:\n            print(data["token"], end="")`}</code>
            </div>

            <h3>JavaScript/Node.js Example</h3>
            <div className="code-block compact">
              <div className="code-header">
                <span className="code-lang">JavaScript</span>
                <button className="copy-btn" onClick={() => handleCopy(`// Non-streaming\nconst response = await fetch('http://localhost:8000/api/chat', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({\n    messages: [{ role: 'user', content: 'Hello' }],\n    stream: false\n  })\n});\nconst data = await response.json();\nconsole.log(data.message.content);\n\n// Streaming\nconst response = await fetch('http://localhost:8000/api/chat', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({\n    messages: [{ role: 'user', content: 'Tell me a joke' }],\n    stream: true\n  })\n});\n\nconst reader = response.body.getReader();\nconst decoder = new TextDecoder();\nwhile (true) {\n  const { value, done } = await reader.read();\n  if (done) break;\n  const chunk = decoder.decode(value);\n  const lines = chunk.split('\\n').filter(line => line.trim());\n  for (const line of lines) {\n    const data = JSON.parse(line);\n    if (data.token) process.stdout.write(data.token);\n  }\n}`)}>Copy</button>
              </div>
              <code className="code-content">{`// Non-streaming\nconst response = await fetch('http://localhost:8000/api/chat', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({\n    messages: [{ role: 'user', content: 'Hello' }],\n    stream: false\n  })\n});\nconst data = await response.json();\nconsole.log(data.message.content);\n\n// Streaming\nconst response = await fetch('http://localhost:8000/api/chat', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({\n    messages: [{ role: 'user', content: 'Tell me a joke' }],\n    stream: true\n  })\n});\n\nconst reader = response.body.getReader();\nconst decoder = new TextDecoder();\nwhile (true) {\n  const { value, done } = await reader.read();\n  if (done) break;\n  const chunk = decoder.decode(value);\n  const lines = chunk.split('\\n').filter(line => line.trim());\n  for (const line of lines) {\n    const data = JSON.parse(line);\n    if (data.token) process.stdout.write(data.token);\n  }\n}`}</code>
            </div>

            <h3>API Authentication (Optional)</h3>
            <p>If you set <code>MOTH_API_KEY</code> when starting the server:</p>
            <div className="code-block compact">
              <div className="code-header">
                <span className="code-lang">HTTP</span>
                <button className="copy-btn" onClick={() => handleCopy(`curl -X POST http://localhost:8000/api/chat \\\n  -H "Authorization: Bearer your-secret-key" \\\n  -H "Content-Type: application/json" \\\n  -d '{"messages": [{"role": "user", "content": "Hello"}]}'`)}>Copy</button>
              </div>
              <code className="code-content">{`curl -X POST http://localhost:8000/api/chat \\\n  -H "Authorization: Bearer your-secret-key" \\\n  -H "Content-Type: application/json" \\\n  -d '{"messages": [{"role": "user", "content": "Hello"}]}'`}</code>
            </div>

            <h3>Network Access</h3>
            <p>Enable network access to use Moth from other devices on your LAN:</p>
            <div className="code-block compact">
              <div className="code-header">
                <span className="code-lang">HTTP</span>
                <button className="copy-btn" onClick={() => handleCopy(`# Enable\ncurl -X POST http://localhost:8000/api/network/enable\n\n# Check status\ncurl http://localhost:8000/api/network/status\n\n# Get QR code (downloads a PNG)\ncurl http://localhost:8000/api/network/qr --output qr.png`)}>Copy</button>
              </div>
              <code className="code-content">{`# Enable\ncurl -X POST http://localhost:8000/api/network/enable\n\n# Check status\ncurl http://localhost:8000/api/network/status\n\n# Get QR code (downloads a PNG)\ncurl http://localhost:8000/api/network/qr --output qr.png`}</code>
            </div>
          </section>

          <section id="configuration" className="docs-section">
            <h2>Configuration</h2>
            <h3>Environment Variables</h3>
            <table className="docs-table">
              <thead>
                <tr><th>Variable</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>MOTH_HOST</code></td><td>127.0.0.1</td><td>Bind address</td></tr>
                <tr><td><code>MOTH_PORT</code></td><td>8000</td><td>HTTP port</td></tr>
                <tr><td><code>MOTH_MODEL_DIR</code></td><td>~/Moth/models</td><td>Model storage directory</td></tr>
                <tr><td><code>MOTH_API_KEY</code></td><td>(none)</td><td>API authentication key</td></tr>
                <tr><td><code>MOTH_LLAMA_HOST</code></td><td>127.0.0.1</td><td>llama-server host</td></tr>
                <tr><td><code>MOTH_LLAMA_PORT</code></td><td>8080</td><td>llama-server port</td></tr>
                <tr><td><code>MOTH_NETWORK_ACCESS</code></td><td>0</td><td>Enable LAN access (1/true/yes/on)</td></tr>
                <tr><td><code>MOTH_HF_TOKEN</code></td><td>(none)</td><td>Hugging Face token for gated models</td></tr>
              </tbody>
            </table>

            <h3>Settings File</h3>
            <p>User settings are stored in <code>moth_config.json</code> in the application data directory.</p>
          </section>

          <section id="troubleshooting" className="docs-section">
            <h2>Troubleshooting</h2>

            <h3>Model Fails to Load</h3>
            <p>If a model fails to load, Moth will automatically attempt to use a fallback model. Check <code>/api/models/status</code> for details.</p>

            <h3>GPU Detection Issues</h3>
            <p>Moth auto-detects NVIDIA (CUDA), AMD (ROCm), and Apple Silicon (Metal) GPUs. If GPU offload fails, it falls back to CPU-only mode.</p>

            <h3>Logs</h3>
            <p>Moth logs to the console by default. For more detailed logs, set <code>MOTH_LOG_LEVEL=DEBUG</code>.</p>

            <h3>Common Issues</h3>
            <ul>
              <li><strong>Port already in use:</strong> Change <code>MOTH_PORT</code> or <code>MOTH_LLAMA_PORT</code></li>
              <li><strong>Model not found:</strong> Ensure models are in <code>MOTH_MODEL_DIR</code></li>
              <li><strong>Permission denied:</strong> Check that the llama-server binary is executable</li>
              <li><strong>409 Conflict:</strong> The model is busy generating a response — wait and try again</li>
              <li><strong>Gated model access:</strong> Set <code>MOTH_HF_TOKEN</code> with a Hugging Face access token</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo" onClick={() => setCurrentView('home')}>
            <img src={logo} alt="Moth" className="logo-img" />
          </div>
        </div>
        <div className="nav-center">
          <button
            className={`nav-link ${currentView === 'models' ? 'active' : ''}`}
            onClick={() => setCurrentView('models')}
          >
            Models
          </button>
          <button
            className={`nav-link ${currentView === 'documentation' ? 'active' : ''}`}
            onClick={() => setCurrentView('documentation')}
          >
            Documentation
          </button>
          <button
            className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentView('home')}
          >
            Download
          </button>
        </div>
      </nav>

      <main className="main-content">
        {currentView === 'home' && renderHome()}
        {currentView === 'models' && renderModels()}
        {currentView === 'documentation' && renderDocumentation()}
      </main>

      <footer className="footer">
        <span>Moth v{version}</span>
        <a href="#documentation" onClick={() => setCurrentView('documentation')}>Documentation</a>
      </footer>
    </div>
  );
};

export default App;