using System.Runtime.InteropServices;

namespace WindowUtils;

public class Scroll {

	private struct LPSCROLLINFO {
		public UInt32 cbSize;
		public UInt32 fMask;
		public int nMin;
		public int nMax;
		public UInt32 nPage;
		public int nPos;
		public int nTrackPos;
	}

	private enum ScrollInfoMask : uint {
		SIF_RANGE = 0x1,
		SIF_PAGE = 0x2,
		SIF_POS = 0x4,
		SIF_DISABLENOSCROLL = 0x8,
		SIF_TRACKPOS = 0x10,
		SIF_ALL = (SIF_RANGE | SIF_PAGE | SIF_POS | SIF_TRACKPOS),
	}

	private const int SB_HORZ = 0;
	private const int SB_VERT = 1;
	private const int SB_CTL = 2;

	[DllImport("user32.dll")]
	[return: MarshalAs(UnmanagedType.Bool)]
	private static extern bool GetScrollInfo(IntPtr hwnd, int nBar, ref LPSCROLLINFO lpsi);

	private static int GetScroll(IntPtr hwnd) {
		LPSCROLLINFO lpsi = new LPSCROLLINFO();

		lpsi.cbSize = Convert.ToUInt32(Marshal.SizeOf(lpsi));
		lpsi.fMask = (uint)ScrollInfoMask.SIF_ALL;

		bool success = GetScrollInfo(hwnd, SB_VERT, ref lpsi);

		return success ? lpsi.nPos : -1;
	}

	public async Task<object> Invoke(dynamic input) {
		return GetScroll((int)input.hwnd);
	}
	
}
