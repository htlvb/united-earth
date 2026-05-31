<script lang="ts">
  import { _ } from 'svelte-i18n';
</script>

<footer id="footer" class="wrapper style1-alt">
  <div class="inner">
    <ul class="menu">
      <li><a href="/">&copy; United-Earth2025. All rights reserved.</a></li>
      <li>Design: <a href="http://html5up.net" target="_blank" rel="noopener">HTML5 UP</a></li>
      <li><a href="/privacy_policies">{$_('privacy_policies')}</a></li>
      <li><a href="/about_us">{$_('about_us')}</a></li>
      <li><a href="/sources">{$_('sources')}</a></li>
    </ul>
  </div>
</footer>
