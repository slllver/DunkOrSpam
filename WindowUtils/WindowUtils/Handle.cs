using System.Runtime.InteropServices;

namespace WindowUtils;

public class Handle {

	[DllImport("user32.dll")]
	[return: MarshalAs(UnmanagedType.SysInt)]
	private static extern IntPtr FindWindowA(string lpClassName, string lpWindowName);

	private static IntPtr FindWindow(string lpWindowName) {
		return FindWindowA(null!, lpWindowName);
	}

	public async Task<object> Invoke(dynamic input) {
		IntPtr hwnd = -1;
		
		await Task.Run(() => hwnd = FindWindow(input.windowName));
		
		return hwnd.ToInt32();
	}

	
}
