<script lang="ts">
  import type { LayoutData } from './$types';
  let { children, data }: { children: any; data: LayoutData } = $props();
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Partner sub-nav (sits below main nav at top-20) -->
  <div class="fixed top-20 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-12">
      <div class="flex items-center gap-1">
        <a href="/partner"
          class="px-4 py-2 text-sm font-medium text-[#0077b6] border-b-2 border-[#0077b6]">
          My Listings
        </a>
      </div>
      <span class="text-xs text-gray-400">{data.partner.company}</span>
    </div>
  </div>
  <div class="pt-[128px]">
    {@render children()}
  </div>
</div>
