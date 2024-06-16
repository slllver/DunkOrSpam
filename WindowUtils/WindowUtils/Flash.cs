using System.Runtime.InteropServices;

namespace WindowUtils;

public class Flash {
	
	[StructLayout(LayoutKind.Sequential)]
	private struct FLASHWINFO {
		public UInt32 cbSize;
		public IntPtr hwnd;
		public UInt32 dwFlags;
		public UInt32 uCount;
		public UInt32 dwTimeout;
	}

	//Stop flashing. The system restores the window to its original state. 
	const UInt32 FLASHW_STOP = 0;

	//Flash the window caption. 
	const UInt32 FLASHW_CAPTION = 1;

	//Flash the taskbar button. 
	const UInt32 FLASHW_TRAY = 2;

	//Flash both the window caption and taskbar button.
	//This is equivalent to setting the FLASHW_CAPTION | FLASHW_TRAY flags. 
	const UInt32 FLASHW_ALL = 3;

	//Flash continuously, until the FLASHW_STOP flag is set. 
	const UInt32 FLASHW_TIMER = 4;

	//Flash continuously until the window comes to the foreground. 
	const UInt32 FLASHW_TIMERNOFG = 12;

	[DllImport("user32.dll")]
	[return: MarshalAs(UnmanagedType.Bool)]
	private static extern bool FlashWindowEx(ref FLASHWINFO pwfi);

	private static bool FlashWindow(IntPtr handle, UInt32 timeout, UInt32 count) {
		IntPtr hWnd = handle;
		FLASHWINFO fInfo = new FLASHWINFO();

		fInfo.cbSize = Convert.ToUInt32(Marshal.SizeOf(fInfo));
		fInfo.hwnd = hWnd;
		fInfo.dwFlags = FLASHW_ALL | FLASHW_TIMERNOFG;
		fInfo.uCount = count;
		fInfo.dwTimeout = timeout;

		return FlashWindowEx(ref fInfo);
	}

	public async Task<object> Invoke(dynamic input) {
		int handle = (int)input.handle;
		int timeout = (int)input.timeout;
		int count = (int)input.count;
		
		return FlashWindow(handle, (uint)timeout, (uint)count);
	}
	
}
