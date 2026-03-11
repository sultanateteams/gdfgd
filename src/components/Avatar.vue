<script setup lang="ts">
import { ref, computed } from "vue";
import defaultAvatarPng from "@/assets/icon/Avatar.svg";

interface Props {
  link?: string;
  name?: string;
}

const props = withDefaults(defineProps<Props>(), {
  link: "",
});

const imgError = ref(false);
const lightboxOpen = ref(false);

const showImage = computed(() => !!props.link && !imgError.value);

function onImgError() {
  imgError.value = true;
}

function openLightbox() {
  lightboxOpen.value = true;
}

function closeLightbox() {
  lightboxOpen.value = false;
}

function onLightboxKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") closeLightbox();
}
</script>

<template>
  <!-- Avatar trigger -->
  <button
    class="avatar-btn"
    :aria-label="`${name} profilini ko'rish`"
    @click="openLightbox"
  >
    <div class="avatar-ring">
      <img
        v-if="showImage"
        :src="link"
        :alt="name"
        class="avatar-img"
        draggable="false"
        @error="onImgError"
      />
      <div v-else class="avatar-fallback">
        <img
          :src="defaultAvatarPng"
          :alt="name"
          class="avatar-default-img"
          draggable="false"
        />
      </div>
    </div>
  </button>

  <!-- Lightbox overlay -->
  <Teleport to="body">
    <Transition name="lb">
      <div
        v-if="lightboxOpen"
        class="lightbox-overlay"
        role="dialog"
        :aria-label="`${name} rasmi`"
        aria-modal="true"
        tabindex="-1"
        @click.self="closeLightbox"
        @keydown="onLightboxKeydown"
      >
        <div class="lightbox-card">
          <!-- Close button -->
          <button class="lb-close" aria-label="Yopish" @click="closeLightbox">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M15 5L5 15M5 5l10 10"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>

          <!-- Full image -->
          <div class="lb-image-wrap">
            <img
              v-if="showImage"
              :src="link"
              :alt="name"
              class="lb-img"
              draggable="false"
              @error="onImgError"
            />
            <div v-else class="lb-fallback">
              <img
                :src="defaultAvatarPng"
                :alt="name"
                class="lb-default-img"
                draggable="false"
              />
            </div>
          </div>

          <!-- Full name -->
          <div class="lb-name">{{ name }}</div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Avatar button ─────────────────────────────────── */
.avatar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.avatar-btn:hover {
  transform: scale(1.06);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.35);
}

.avatar-btn:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 3px;
}

.avatar-ring {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(99, 102, 241, 0.5);
  position: relative;
  background: #e0e7ff;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ── Fallback (default avatar) ── */
.avatar-fallback {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-default-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ── Lightbox ──────────────────────────────────────── */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(8, 8, 18, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
}

.lightbox-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  width: 100%;
  height: 100%;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  justify-content: center;
}

.lb-close {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.15s,
    color 0.15s,
    transform 0.15s;
  z-index: 10000;
}

.lb-close:hover {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  transform: rotate(90deg);
}

/* ── Lightbox image ─────────────────────────────── */
.lb-image-wrap {
  width: min(70vw, 70vh);
  height: min(70vw, 70vh);
  overflow: hidden;
  border: 3px solid rgba(99, 102, 241, 0.55);
  box-shadow:
    0 0 0 8px rgba(99, 102, 241, 0.12),
    0 24px 80px rgba(0, 0, 0, 0.6);
  position: relative;
  background: #1e1b4b;
  flex-shrink: 0;
}

.lb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.lb-fallback {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lb-default-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ── Name label ─────────────────────────────────── */
.lb-name {
  font-family: "Segoe UI", system-ui, sans-serif;
  font-size: clamp(18px, 2.5vw, 26px);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  letter-spacing: 0.02em;
  text-align: center;
  word-break: break-word;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
}

/* ── Transitions ────────────────────────────────── */
.lb-enter-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.lb-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}
.lb-enter-from {
  opacity: 0;
  transform: scale(0.88);
}
.lb-leave-to {
  opacity: 0;
  transform: scale(0.94);
}
</style>
